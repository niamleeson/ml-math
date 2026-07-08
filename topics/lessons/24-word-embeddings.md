# Word Embeddings: word2vec & GloVe
> **Source:** CS 230 · **Category:** Method · **Type:** 💻 Colab · [↑ Full reference](../../ai-ml-cheatsheets.md)
> 📓 Runnable notebook section; an `.ipynb` will be generated.

## 0. Step-by-Step Worked Example — Start Here (Beginner Friendly)

> 🧑‍🎓 **New to this topic? Start here.** This is a gentle, fully runnable walkthrough that
> builds up *every* idea in this lesson one tiny step at a time. Each step **prints** the
> numbers it computes and **draws a picture** so you can *see* what is happening. Run the
> cells in order from top to bottom. Nothing here needs the internet or any downloaded data.

### The Big Picture — What You'll Learn

In plain terms, here is what the steps below will show you:

- A **one-hot word** selects a dense column from an embedding matrix.
- **word2vec** uses local prediction: skip-gram softmax, negative-sampling binary scores, and CBOW context averaging.
- **GloVe** uses global co-occurrence counts and fits dot products to log counts, then averages target/context vectors.
- **Cosine similarity**, **analogy arithmetic**, and **2-D projections** make embedding geometry inspectable.

Everything below (starting at **§1 Overview**) develops these same ideas with fuller training loops,
nearest-neighbor tables, analogy examples, and visualization diagnostics.

**What we will build, step by step:**
1. **Dense lookup from a one-hot word** — use an embedding matrix as a lookup table.
2. **word2vec from local prediction** — skip-gram softmax, negative sampling, and CBOW averaging.
3. **GloVe from global counts** — co-occurrence counts, log-count reconstruction, and final vector averaging.
4. **Compare, solve analogies, and visualize** — cosine similarity, vector arithmetic, and a PCA map.

### Step 0 — Set up our tools

We import NumPy (vectors + matrix math) and Matplotlib (pictures). We fix a random **seed** so
every run is reproducible, then define a tiny `log()` helper for clearly labeled output.

```python
import numpy as np                       # NumPy: one-hot vectors, embedding matrices, softmax, and cosine math.
import matplotlib.pyplot as plt          # Matplotlib: draw lookup tables, probabilities, heatmaps, and embedding maps.

np.random.seed(0)                         # Fix the seed so every run prints the SAME numbers.
plt.rcParams["figure.figsize"] = (7, 4)   # A comfortable default plot size.

def log(label, value):                    # A tiny logger so each printed line explains itself.
    print(f"[{label}] {value}")           # Format is: [what this is] the value.

log("setup", "tools ready — NumPy + Matplotlib imported, seed fixed to 0")
```
▶ What you'll see: one line confirming the tools are ready.

### Step 1 — Dense lookup from a one-hot word

A one-hot vector stores only a word's ID. Multiplying by an embedding matrix $E$ selects the
column for that word: $e_w=Eo_w$. The dense column can then live near related words in geometry.

```python
vocab_demo = np.array(["cat", "dog", "king", "queen"])                      # A tiny vocabulary in a fixed column order.
word_demo = "king"                                                          # The word we want to look up.
index_demo = int(np.where(vocab_demo == word_demo)[0][0])                   # Find the vocabulary index for the word.
one_hot_demo = np.zeros(len(vocab_demo))                                    # Start with all zeros.
one_hot_demo[index_demo] = 1.0                                              # Put the single 1 at the chosen word's index.
embedding_matrix_demo = np.array([[0.90, 0.82, -0.35, -0.28], [0.10, 0.18, 0.95, 0.88]]) # E has shape embedding_dim by vocabulary_size.
embedding_demo = embedding_matrix_demo @ one_hot_demo                       # Matrix multiplication selects one column of E.

log("vocabulary order", vocab_demo.tolist())                                # Print the word-to-column order.
log("one-hot for king", one_hot_demo)                                       # Print the sparse ID vector.
log("embedding matrix shape", embedding_matrix_demo.shape)                  # Print E's dimensions.
log("looked-up dense vector", embedding_demo)                               # Print the selected dense vector.
log("same as E column?", bool(np.allclose(embedding_demo, embedding_matrix_demo[:, index_demo]))) # Verify lookup equals direct column selection.

fig_demo, axes_demo = plt.subplots(1, 2, figsize=(10, 4))                   # Create a matrix panel and a geometry panel.
image_demo = axes_demo[0].imshow(embedding_matrix_demo, cmap="Blues", aspect="auto") # Show the embedding table as a heatmap.
axes_demo[0].axvline(index_demo, color="red", linewidth=3, label="selected column") # Highlight the chosen word's column.
axes_demo[0].set_xticks(np.arange(len(vocab_demo)))                         # Set one tick per vocabulary word.
axes_demo[0].set_xticklabels(vocab_demo)                                    # Label columns by word.
axes_demo[0].set_yticks([0, 1])                                             # Set one tick per embedding dimension.
axes_demo[0].set_yticklabels(["dim 1", "dim 2"])                            # Label embedding dimensions.
axes_demo[0].set_title("E matrix selects one column")                       # Title the lookup heatmap.
axes_demo[0].legend()                                                       # Explain the selected column.
plt.colorbar(image_demo, ax=axes_demo[0], fraction=0.046)                   # Add a color scale for matrix values.
axes_demo[1].scatter(embedding_matrix_demo[0], embedding_matrix_demo[1], s=90) # Plot every word vector in 2-D.
for word_label_demo, vector_demo in zip(vocab_demo, embedding_matrix_demo.T): # Label each vector endpoint.
    axes_demo[1].text(vector_demo[0] + 0.02, vector_demo[1] + 0.02, word_label_demo) # Add a word label.
axes_demo[1].scatter(embedding_demo[0], embedding_demo[1], s=220, facecolors="none", edgecolors="black", linewidths=2, label="lookup result") # Highlight selected vector.
axes_demo[1].set_xlabel("dense coordinate 1")                               # Label x-axis.
axes_demo[1].set_ylabel("dense coordinate 2")                               # Label y-axis.
axes_demo[1].set_title("Dense vectors can have neighborhoods")              # Title the geometry panel.
axes_demo[1].legend()                                                       # Explain the highlight.
plt.tight_layout()                                                          # Keep panels readable.
plt.show()                                                                  # Render the lookup visualization.
```
▶ What you'll see: the one-hot vector selects the `king` column, and the dense map places `king` near `queen`.

### Step 2 — word2vec: learn from local prediction

Skip-gram predicts nearby context words from a center word with a softmax. Negative sampling
replaces the full softmax with small binary classifiers, and CBOW reverses direction by averaging
context vectors to predict the missing center word.

```python
vocab_w2v_demo = np.array(["king", "queen", "dog", "crown"])                # A small vocabulary for local prediction.
center_word_demo = "king"                                                   # Center word c.
true_context_demo = "queen"                                                 # Observed nearby context word t.
negative_context_demo = "dog"                                               # A sampled non-neighbor for negative sampling.
center_index_demo = int(np.where(vocab_w2v_demo == center_word_demo)[0][0]) # Center word index.
true_index_demo = int(np.where(vocab_w2v_demo == true_context_demo)[0][0])  # True context index.
negative_index_demo = int(np.where(vocab_w2v_demo == negative_context_demo)[0][0]) # Negative context index.
input_vectors_demo = np.array([[0.20, 0.90], [0.10, 0.85], [0.85, 0.05], [0.30, 0.70]]) # Input embeddings e_c.
context_vectors_demo = np.array([[0.15, 0.80], [0.05, 0.55], [0.70, 0.10], [0.25, 0.60]]) # Output/context vectors theta_j.
center_vector_demo = input_vectors_demo[center_index_demo]                  # Look up e_king.

def softmax_demo(scores_demo):                                              # Define a stable softmax for the tiny vocabulary.
    shifted_demo = scores_demo - np.max(scores_demo)                        # Subtract max for numerical stability.
    exp_demo = np.exp(shifted_demo)                                         # Convert scores to positive weights.
    return exp_demo / exp_demo.sum()                                        # Normalize weights into probabilities.

def sigmoid_demo(score_demo):                                               # Define sigmoid for negative sampling.
    return 1.0 / (1.0 + np.exp(-np.clip(score_demo, -40.0, 40.0)))           # Convert one dot product into a binary probability.

scores_demo = context_vectors_demo @ center_vector_demo                     # Skip-gram scores theta_j^T e_c for all context words.
probs_demo = softmax_demo(scores_demo)                                      # Full-softmax P(t | c).
positive_logit_demo = float(context_vectors_demo[true_index_demo] @ center_vector_demo) # Positive-pair dot product.
negative_logit_demo = float(context_vectors_demo[negative_index_demo] @ center_vector_demo) # Negative-pair dot product.
positive_prob_demo = float(sigmoid_demo(positive_logit_demo))               # Negative-sampling P(y=1 | king, queen).
negative_prob_demo = float(sigmoid_demo(negative_logit_demo))               # Negative-sampling P(y=1 | king, dog).
context_average_demo = (input_vectors_demo[true_index_demo] + input_vectors_demo[3]) / 2.0 # CBOW averages context vectors queen and crown.
cbow_scores_demo = context_vectors_demo @ context_average_demo              # CBOW scores candidates from averaged context.
cbow_probs_demo = softmax_demo(cbow_scores_demo)                            # CBOW probabilities for the missing center word.

log("skip-gram softmax P(context | king)", dict(zip(vocab_w2v_demo.tolist(), np.round(probs_demo, 3)))) # Print full softmax distribution.
log("P(true context queen | king)", round(float(probs_demo[true_index_demo]), 3)) # Print observed context probability.
log("negative sampling positive pair", round(positive_prob_demo, 3))         # Print sigmoid score for observed pair.
log("negative sampling negative pair", round(negative_prob_demo, 3))         # Print sigmoid score for sampled non-neighbor.
log("CBOW P(king | queen,crown avg)", round(float(cbow_probs_demo[center_index_demo]), 3)) # Print CBOW probability for center.

fig_demo, axes_demo = plt.subplots(1, 2, figsize=(10, 4))                   # Create softmax and negative-sampling panels.
axes_demo[0].bar(vocab_w2v_demo, probs_demo, color="steelblue")             # Draw skip-gram context probabilities.
axes_demo[0].set_ylim(0.0, 1.0)                                             # Probabilities live in [0,1].
axes_demo[0].set_ylabel("softmax probability")                              # Label probability scale.
axes_demo[0].set_title("skip-gram: predict nearby context")                 # Title skip-gram panel.
axes_demo[1].bar(["observed\nking-queen", "negative\nking-dog"], [positive_prob_demo, negative_prob_demo], color=["seagreen", "salmon"]) # Draw binary pair scores.
axes_demo[1].set_ylim(0.0, 1.0)                                             # Sigmoid probabilities live in [0,1].
axes_demo[1].set_ylabel("P(y=1 | pair)")                                    # Label binary classifier output.
axes_demo[1].set_title("negative sampling: classify pairs")                 # Title negative-sampling panel.
plt.tight_layout()                                                          # Prevent overlap.
plt.show()                                                                  # Render word2vec visualization.
```
▶ What you'll see: skip-gram gives every context a probability, negative sampling scores one positive and one negative pair, and CBOW uses an averaged context.

### Step 3 — GloVe: learn from global counts

GloVe first builds a co-occurrence matrix $X$. Then it learns target and context vectors whose dot
products, plus biases in the full model, reconstruct $\log(X_{ij})$ for observed counts; a final
embedding often averages target and context vectors.

```python
sentences_glove_demo = [["king", "queen", "crown"], ["king", "crown", "palace"], ["queen", "crown", "palace"], ["dog", "pet", "home"], ["dog", "pet", "cat"]] # Tiny corpus.
vocab_glove_demo = np.array(["king", "queen", "crown", "palace", "dog", "pet", "cat", "home"]) # Stable vocabulary order.
w2i_glove_demo = {word_demo: index_demo for index_demo, word_demo in enumerate(vocab_glove_demo)} # Word-to-index mapping.
counts_glove_demo = np.zeros((len(vocab_glove_demo), len(vocab_glove_demo))) # Initialize co-occurrence matrix X.
window_glove_demo = 1                                                       # Count immediate neighbors.

for sentence_demo in sentences_glove_demo:                                  # Scan each tokenized sentence.
    for center_pos_demo, center_token_demo in enumerate(sentence_demo):      # Choose each word as a target row.
        left_demo = max(0, center_pos_demo - window_glove_demo)              # Left edge of context window.
        right_demo = min(len(sentence_demo), center_pos_demo + window_glove_demo + 1) # Right edge of context window.
        for context_pos_demo in range(left_demo, right_demo):                # Scan nearby context positions.
            if context_pos_demo != center_pos_demo:                         # Skip the target word itself.
                context_token_demo = sentence_demo[context_pos_demo]         # Read context word.
                counts_glove_demo[w2i_glove_demo[center_token_demo], w2i_glove_demo[context_token_demo]] += 1.0 # Add one co-occurrence count.

target_vectors_demo = np.array([[1.00, 0.25], [0.95, 0.30], [0.85, 0.35], [0.70, 0.45], [-0.80, 0.20], [-0.75, 0.15], [-0.70, 0.10], [-0.65, 0.05]]) # Toy target vectors.
context_vectors_glove_demo = np.array([[0.95, 0.30], [0.90, 0.35], [0.82, 0.38], [0.65, 0.50], [-0.78, 0.22], [-0.72, 0.18], [-0.68, 0.12], [-0.62, 0.08]]) # Toy context vectors.
final_vectors_glove_demo = (target_vectors_demo + context_vectors_glove_demo) / 2.0 # Average target/context vectors into final embeddings.
positive_mask_demo = counts_glove_demo > 0.0                                # GloVe ignores zero-count pairs in this simplified demo.
log_counts_demo = np.zeros_like(counts_glove_demo)                          # Allocate log-count target matrix.
log_counts_demo[positive_mask_demo] = np.log(counts_glove_demo[positive_mask_demo]) # Fill log targets for observed counts.
fitted_demo = target_vectors_demo @ context_vectors_glove_demo.T            # Dot products that try to reconstruct log counts.
fit_error_demo = fitted_demo[positive_mask_demo] - log_counts_demo[positive_mask_demo] # Errors on observed entries.

log("co-occurrence matrix shape", counts_glove_demo.shape)                  # Print matrix dimensions.
log("observed nonzero pairs", int(positive_mask_demo.sum()))                # Print number of observed counts.
log("X[king,crown]", int(counts_glove_demo[w2i_glove_demo["king"], w2i_glove_demo["crown"]])) # Print one count.
log("dot(king,crown context)", round(float(fitted_demo[w2i_glove_demo["king"], w2i_glove_demo["crown"]]), 3)) # Print one fitted dot product.
log("log X[king,crown]", round(float(log_counts_demo[w2i_glove_demo["king"], w2i_glove_demo["crown"]]), 3)) # Print its log-count target.
log("mean squared fit error", round(float(np.mean(fit_error_demo ** 2)), 3)) # Print overall toy reconstruction error.
log("final vector for king", np.round(final_vectors_glove_demo[w2i_glove_demo["king"]], 3)) # Print averaged final embedding.

plt.imshow(counts_glove_demo, cmap="Blues")                                 # Visualize the global co-occurrence matrix.
plt.xticks(np.arange(len(vocab_glove_demo)), vocab_glove_demo, rotation=45, ha="right") # Label context columns.
plt.yticks(np.arange(len(vocab_glove_demo)), vocab_glove_demo)              # Label target rows.
plt.colorbar(label="co-occurrence count")                                   # Add count scale.
plt.title("GloVe starts from a global co-occurrence matrix")                # Title the heatmap.
plt.tight_layout()                                                          # Prevent label clipping.
plt.show()                                                                  # Render the GloVe heatmap.
```
▶ What you'll see: royalty words co-occur with royalty words, pet words with pet words, and dot products are compared with log-count targets.

### Step 4 — Compare, solve analogies, and visualize

After training, embeddings become useful through geometry. Cosine similarity compares directions,
analogy arithmetic forms query vectors like $e_{\text{king}}-e_{\text{man}}+e_{\text{woman}}$,
and 2-D projections such as PCA (or t-SNE for local neighborhoods) help us inspect the map.

```python
words_geom_demo = np.array(["man", "woman", "king", "queen", "prince", "princess", "cat", "dog", "computer"]) # Words to compare and plot.
vectors_geom_demo = np.array([[-1.0, 0.0, 0.0], [1.0, 0.0, 0.0], [-1.0, 1.0, 0.0], [1.0, 1.0, 0.0], [-1.0, 0.8, 0.0], [1.0, 0.8, 0.0], [0.0, 0.0, 1.0], [0.05, 0.0, 0.95], [0.0, -0.2, -1.0]]) # Gender, royalty, and animal/tech directions.
w2i_geom_demo = {word_demo: index_demo for index_demo, word_demo in enumerate(words_geom_demo)} # Word-to-row lookup.

def cosine_geom_demo(a_demo, b_demo):                                       # Define cosine similarity for embeddings.
    denom_demo = max(np.linalg.norm(a_demo) * np.linalg.norm(b_demo), 1e-12) # Protect against zero-length vectors.
    return float((a_demo @ b_demo) / denom_demo)                             # Return normalized dot product.

query_geom_demo = vectors_geom_demo[w2i_geom_demo["king"]] - vectors_geom_demo[w2i_geom_demo["man"]] + vectors_geom_demo[w2i_geom_demo["woman"]] # Analogy query.
candidate_scores_demo = []                                                  # Store valid analogy candidates.
for word_demo in words_geom_demo:                                           # Score every candidate word.
    if word_demo not in {"king", "man", "woman"}:                           # Exclude input words from the answer.
        score_demo = cosine_geom_demo(query_geom_demo, vectors_geom_demo[w2i_geom_demo[word_demo]]) # Compare candidate direction to query.
        candidate_scores_demo.append((word_demo, score_demo))               # Save candidate and cosine score.
candidate_scores_demo = sorted(candidate_scores_demo, key=lambda pair_demo: pair_demo[1], reverse=True) # Rank candidates by similarity.

log("cosine(cat,dog)", round(cosine_geom_demo(vectors_geom_demo[w2i_geom_demo["cat"]], vectors_geom_demo[w2i_geom_demo["dog"]]), 3)) # Print similar animal cosine.
log("cosine(cat,computer)", round(cosine_geom_demo(vectors_geom_demo[w2i_geom_demo["cat"]], vectors_geom_demo[w2i_geom_demo["computer"]]), 3)) # Print unrelated cosine.
log("king - man + woman", query_geom_demo)                                  # Print analogy query vector.
log("nearest analogy candidates", [(word_demo, round(float(score_demo), 3)) for word_demo, score_demo in candidate_scores_demo[:4]]) # Print top analogy answers.

mean_geom_demo = vectors_geom_demo.mean(axis=0, keepdims=True)              # Center vectors before PCA.
centered_geom_demo = vectors_geom_demo - mean_geom_demo                     # Subtract the mean vector.
u_geom_demo, s_geom_demo, vt_geom_demo = np.linalg.svd(centered_geom_demo, full_matrices=False) # Compute deterministic PCA via SVD.
coords_geom_demo = centered_geom_demo @ vt_geom_demo[:2].T                  # Project words onto the first two principal components.
query_coord_demo = (query_geom_demo - mean_geom_demo.ravel()) @ vt_geom_demo[:2].T # Project the analogy query into the same map.
coord_lookup_demo = {word_demo: coords_geom_demo[index_demo] for index_demo, word_demo in enumerate(words_geom_demo)} # Map words to projected coordinates.

plt.scatter(coords_geom_demo[:, 0], coords_geom_demo[:, 1], s=90, color="steelblue") # Draw word points.
for word_demo, xy_demo in coord_lookup_demo.items():                         # Label every projected point.
    plt.text(xy_demo[0] + 0.03, xy_demo[1] + 0.03, word_demo)                # Add the word label.
plt.scatter(query_coord_demo[0], query_coord_demo[1], s=230, facecolors="none", edgecolors="black", linewidths=2, label="king-man+woman") # Highlight analogy query.
plt.arrow(coord_lookup_demo["man"][0], coord_lookup_demo["man"][1], coord_lookup_demo["woman"][0] - coord_lookup_demo["man"][0], coord_lookup_demo["woman"][1] - coord_lookup_demo["man"][1], color="orange", head_width=0.04, length_includes_head=True) # Draw man-to-woman offset.
plt.arrow(coord_lookup_demo["king"][0], coord_lookup_demo["king"][1], coord_lookup_demo["queen"][0] - coord_lookup_demo["king"][0], coord_lookup_demo["queen"][1] - coord_lookup_demo["king"][1], color="orange", head_width=0.04, length_includes_head=True) # Draw king-to-queen offset.
plt.xlabel("PCA dimension 1")                                                # Label first projection axis.
plt.ylabel("PCA dimension 2")                                                # Label second projection axis.
plt.title("Cosine, analogy arithmetic, and a 2-D PCA visualization")         # Title the geometry plot.
plt.legend()                                                                # Explain the query marker.
plt.axis("equal")                                                           # Preserve relative geometry.
plt.show()                                                                  # Render embedding geometry.
```
▶ What you'll see: `cat` is much closer to `dog` than to `computer`, the analogy query ranks `queen` first, and PCA shows the relation arrows.

---

## 1. Overview

Word embeddings replace isolated one-hot word IDs with dense vectors whose geometry carries information about similarity, context, and relationships. They are learned from text by solving proxy tasks such as predicting nearby words or reconstructing co-occurrence counts.

**One-line intuition:** embeddings turn words into points, so "nearby" can mean "used similarly," and directions can encode relationships such as $\text{king}-\text{man}+\text{woman}\approx\text{queen}$.

## 2. Key Idea

### Dense lookup from a one-hot word

Let $V$ be the vocabulary and $o_w\in\mathbb{R}^{|V|}$ be a one-hot vector for word $w$. An embedding matrix $E\in\mathbb{R}^{d\times |V|}$ maps that sparse code to a dense vector:

$$
\boxed{e_w=Eo_w}
$$

In code, multiplying by $o_w$ is exactly selecting one column of $E$. The learning problem is to choose the columns so words with related contexts have related vectors.

### word2vec: learn from local prediction

In **skip-gram**, a center/context word $c$ predicts a nearby target word $t$:

$$
\boxed{P(t\mid c)=\frac{\exp(\theta_t^Te_c)}{\sum_{j=1}^{|V|}\exp(\theta_j^Te_c)}}
$$

The softmax denominator is expensive for large vocabularies, so **negative sampling** trains small binary classifiers instead:

$$
\boxed{P(y=1\mid c,t)=\sigma(\theta_t^Te_c)}
$$

Observed center-target pairs get label $1$; randomly sampled non-neighbor pairs get label $0$. **CBOW** reverses the direction: average surrounding context vectors, then predict the missing center word.

### GloVe: learn from global counts

GloVe builds a co-occurrence matrix $X$ where $X_{ij}$ counts how often context word $j$ appears near target word $i$. It learns vectors whose dot products reconstruct log co-occurrence:

$$
\boxed{J(\theta)=\frac{1}{2}\sum_{i,j=1}^{|V|}f(X_{ij})\left(\theta_i^Te_j+b_i+b_j'-\log(X_{ij})\right)^2}
$$

where $f(X_{ij})=0$ when $X_{ij}=0$. Because target and context vectors are symmetric, a final embedding is often

$$
\boxed{e_w^{(\textrm{final})}=\frac{e_w+\theta_w}{2}}.
$$

### Compare, solve analogies, and visualize

Cosine similarity compares directions:

$$
\boxed{\operatorname{cosine}(w_1,w_2)=\frac{w_1\cdot w_2}{\|w_1\|\|w_2\|}=\cos(\theta)}
$$

Analogy arithmetic forms a query vector such as $e_{\text{king}}-e_{\text{man}}+e_{\text{woman}}$ and finds its nearest neighbor. PCA and t-SNE reduce vectors to 2-D for visualization; t-SNE is especially useful for local neighborhoods, while PCA is deterministic and good for showing arrows.

## 3. Hands-on Notebook

### Setup

Run this first. Everything is offline, CPU-friendly, and intentionally small enough to inspect.

```python
# !pip -q install numpy pandas matplotlib scikit-learn ipywidgets  # uncomment only if your runtime lacks these standard packages.
import numpy as np  # use NumPy for vector lookup, cosine similarity, and from-scratch SGD.
import pandas as pd  # use pandas for compact ranked tables of neighbors and predictions.
import matplotlib.pyplot as plt  # use Matplotlib for vector diagrams, heatmaps, loss curves, and maps.
from sklearn.decomposition import PCA  # use PCA for deterministic 2-D projections and analogy arrows.
from sklearn.manifold import TSNE  # use t-SNE to visualize local neighborhoods in 2-D.
try:  # try to import widgets for the final interactive experiment.
    from ipywidgets import interact, Dropdown, IntSlider  # use a dropdown and slider in Colab.
except ModuleNotFoundError:  # keep the notebook runnable outside Colab if widgets are missing.
    class _FallbackWidget:  # define a tiny widget replacement for non-widget runtimes.
        def __init__(self, value=None, options=None, min=None, max=None, step=None, description=""):  # accept the same arguments used later.
            self.value = value if value is not None else (options[0] if options else None)  # store a default value.
    Dropdown = _FallbackWidget  # replace Dropdown with the fallback class.
    IntSlider = _FallbackWidget  # replace IntSlider with the fallback class.
    def interact(function, **controls):  # define a fallback interaction wrapper.
        values = {name: control.value for name, control in controls.items()}  # collect default values from fallback controls.
        return function(**values)  # call the function once so the cell remains runnable.
np.random.seed(23024)  # seed NumPy's global generator for reproducible examples.
RNG = np.random.default_rng(23024)  # create a modern seeded random generator for SGD and sampling.
plt.style.use("seaborn-v0_8-whitegrid")  # use a clean plotting style with readable grids.
try:  # try to access the notebook display function.
    display  # reference display so a NameError is raised outside notebooks.
except NameError:  # define a fallback when running the code as a plain Python script.
    def display(obj):  # create a minimal display replacement.
        print(obj)  # print objects in text form outside notebook environments.

TOY_SENTENCES = [  # create a tiny corpus with semantic neighborhoods and a deliberate polysemy case.
    "king queen man woman prince princess royal palace throne crown",  # include royalty and gender relations.
    "king man royal palace throne crown",  # repeat king near male and royal words.
    "queen woman royal palace throne crown",  # repeat queen near female and royal words.
    "cat kitten dog puppy animal pet cute home",  # include animal and pet terms.
    "cat dog animal pet home",  # repeat cat and dog contexts.
    "computer laptop software hardware keyboard screen",  # include technology terms.
    "program code software computer keyboard",  # repeat programming contexts.
    "river bank water stream shore",  # include the river sense of bank.
    "money bank loan finance account",  # include the finance sense of bank.
    "doctor nurse hospital patient medicine care",  # include care professions.
    "engineer programmer software computer code",  # include technical professions.
    "teacher student school lesson knowledge",  # include education terms.
]  # finish the small corpus.

MINI_WORDS = [  # define a tiny predefined embedding vocabulary with no downloads.
    "man", "woman", "king", "queen", "prince", "princess", "royal", "palace",  # add royalty and analogy words.
    "cat", "dog", "kitten", "puppy", "animal", "pet",  # add animal words.
    "computer", "laptop", "software", "hardware", "keyboard", "code", "program",  # add technology words.
    "paris", "france", "rome", "italy", "tokyo", "japan",  # add geography analogy words.
    "doctor", "nurse", "engineer", "teacher", "homemaker", "programmer",  # add profession words.
    "river", "water", "loan", "finance", "bank",  # add polysemy words.
]  # finish the predefined vocabulary.

MINI_VECTORS = np.array([  # create 6-D toy vectors with axes for gender, royalty, animal, tech, geography, and finance/water.
    [-1.00, 0.05, 0.00, 0.00, 0.00, 0.00], [1.00, 0.05, 0.00, 0.00, 0.00, 0.05],  # man and woman differ mainly by gender.
    [-0.85, 1.00, 0.00, 0.00, 0.00, 0.00], [0.85, 1.00, 0.00, 0.00, 0.00, 0.05],  # king and queen share royalty.
    [-0.75, 0.82, 0.00, 0.00, 0.00, 0.00], [0.75, 0.82, 0.00, 0.00, 0.00, 0.05],  # prince and princess repeat the relation.
    [0.00, 0.92, 0.00, 0.00, 0.00, 0.00], [0.00, 0.70, 0.00, 0.00, 0.05, 0.00],  # royal and palace sit near royalty.
    [0.10, 0.00, 1.00, 0.00, 0.00, 0.10], [0.00, 0.00, 0.92, 0.00, 0.00, 0.10],  # cat and dog share animal/pet directions.
    [0.15, 0.00, 1.10, 0.00, 0.00, 0.15], [0.00, 0.00, 1.02, 0.00, 0.00, 0.15],  # kitten and puppy are close to pet words.
    [0.00, 0.00, 0.85, 0.00, 0.00, 0.10], [0.00, 0.00, 0.75, 0.00, 0.00, 0.20],  # animal and pet summarize the animal cluster.
    [0.00, 0.00, 0.00, 1.00, 0.00, 0.00], [0.00, 0.00, 0.00, 0.92, 0.00, 0.00],  # computer and laptop are technology neighbors.
    [0.00, 0.00, 0.00, 1.05, 0.00, 0.05], [0.00, 0.00, 0.00, 0.95, 0.00, 0.00],  # software and hardware share technology.
    [0.00, 0.00, 0.00, 0.82, 0.00, 0.02], [0.00, 0.00, 0.00, 1.10, 0.00, 0.02], [0.00, 0.00, 0.00, 1.08, 0.00, 0.02],  # keyboard, code, and program cluster.
    [0.00, 0.00, 0.00, 0.00, 1.00, 0.00], [0.00, 0.00, 0.00, 0.00, 0.86, 0.00],  # paris and france are a geography pair.
    [0.00, 0.02, 0.00, 0.00, 0.95, 0.00], [0.00, 0.02, 0.00, 0.00, 0.82, 0.00],  # rome and italy form another pair.
    [0.00, 0.01, 0.00, 0.00, 1.05, 0.00], [0.00, 0.01, 0.00, 0.00, 0.90, 0.00],  # tokyo and japan form a third pair.
    [-0.20, 0.00, 0.00, 0.00, 0.00, 0.95], [0.35, 0.00, 0.00, 0.00, 0.00, 0.90],  # doctor and nurse encode toy profession associations.
    [-0.45, 0.00, 0.00, 0.75, 0.00, 0.10], [0.25, 0.00, 0.00, 0.00, 0.00, 0.72],  # engineer and teacher differ on toy axes.
    [0.65, 0.00, 0.00, 0.00, 0.00, 0.65], [-0.35, 0.00, 0.00, 0.85, 0.00, 0.05],  # homemaker and programmer show dataset effects.
    [0.00, 0.00, 0.00, 0.00, 0.00, -0.95], [0.00, 0.00, 0.00, 0.00, 0.00, -0.88],  # river and water encode the water sense.
    [0.00, 0.00, 0.00, 0.05, 0.00, 1.00], [0.00, 0.00, 0.00, 0.05, 0.00, 0.95],  # loan and finance encode the money sense.
    [0.05, 0.00, 0.00, 0.02, 0.00, 0.05],  # bank is deliberately blurred near both senses.
], dtype=float)  # store all predefined vectors as floats.

MINI = {word: MINI_VECTORS[i] for i, word in enumerate(MINI_WORDS)}  # create a convenient word-to-vector dictionary.

def tokenize(sentence):  # define a tiny tokenizer for clean classroom sentences.
    return sentence.lower().replace(".", "").replace(",", "").split()  # lowercase and split because the corpus is already simple.

def build_vocab(sentences, min_count=1):  # define a vocabulary builder.
    counts = {}  # initialize an empty count dictionary.
    for sentence in sentences:  # iterate over corpus sentences.
        for token in tokenize(sentence):  # iterate over tokens in the sentence.
            counts[token] = counts.get(token, 0) + 1  # update the token count.
    words = sorted([word for word, count in counts.items() if count >= min_count])  # keep words meeting the count threshold.
    word_to_idx = {word: i for i, word in enumerate(words)}  # map words to integer rows.
    idx_to_word = {i: word for word, i in word_to_idx.items()}  # map rows back to words.
    return words, word_to_idx, idx_to_word, counts  # return all vocabulary artifacts.

def make_skipgram_pairs(sentences, word_to_idx, window=2):  # define center-context pair generation.
    pairs = []  # store numeric index pairs for training.
    word_pairs = []  # store readable word pairs for display.
    for sentence in sentences:  # process each sentence separately.
        tokens = [token for token in tokenize(sentence) if token in word_to_idx]  # keep known tokens only.
        for center_pos, center_word in enumerate(tokens):  # choose each token as center.
            left = max(0, center_pos - window)  # compute the left window edge.
            right = min(len(tokens), center_pos + window + 1)  # compute the right window edge.
            for context_pos in range(left, right):  # scan context positions.
                if context_pos != center_pos:  # exclude the center itself.
                    context_word = tokens[context_pos]  # read the nearby word.
                    pairs.append((word_to_idx[center_word], word_to_idx[context_word]))  # store numeric center and context indices.
                    word_pairs.append((center_word, context_word))  # store readable center and context words.
    return pairs, word_pairs  # return both pair formats.

def sigmoid(x):  # define the logistic sigmoid.
    return 1.0 / (1.0 + np.exp(-np.clip(x, -30, 30)))  # clip inputs to avoid overflow.

def cosine(a, b):  # define cosine similarity.
    denom = np.linalg.norm(a) * np.linalg.norm(b)  # compute the product of vector lengths.
    return float(np.dot(a, b) / denom) if denom > 0 else 0.0  # avoid division by zero for degenerate vectors.

def cosine_scores(query, matrix):  # define vectorized cosine scores.
    query_norm = np.linalg.norm(query) + 1e-12  # compute query length with a stabilizer.
    matrix_norms = np.linalg.norm(matrix, axis=1) + 1e-12  # compute candidate lengths with a stabilizer.
    return (matrix @ query) / (matrix_norms * query_norm)  # return one cosine score per candidate.

def nearest_neighbors(word, vectors, word_to_idx, idx_to_word, top_k=5, exclude_self=True):  # define a nearest-neighbor table helper.
    query = vectors[word_to_idx[word]]  # look up the query vector.
    scores = cosine_scores(query, vectors)  # compute cosine similarity against every vector.
    order = np.argsort(-scores)  # sort candidates from most similar to least similar.
    rows = []  # create rows for a display table.
    for idx in order:  # scan sorted candidate indices.
        candidate = idx_to_word[idx]  # convert the index back to a word.
        if exclude_self and candidate == word:  # optionally skip the query word.
            continue  # continue to the next candidate.
        rows.append({"word": candidate, "cosine": round(float(scores[idx]), 4)})  # append the ranked neighbor.
        if len(rows) == top_k:  # stop at the requested number of neighbors.
            break  # exit the loop.
    return pd.DataFrame(rows)  # return a readable DataFrame.

def plot_embedding_points(words, vectors, word_to_idx, title, use_first_two=True):  # define a reusable 2-D embedding plot.
    coords = np.array([vectors[word_to_idx[word]][:2] for word in words]) if use_first_two else project_2d(np.array([vectors[word_to_idx[word]] for word in words]), "pca")  # choose raw first coordinates or PCA.
    plt.figure(figsize=(7, 5.5))  # create a readable figure.
    for word, xy in zip(words, coords):  # draw every selected word.
        plt.arrow(0, 0, xy[0], xy[1], head_width=0.035, length_includes_head=True, alpha=0.65)  # show each vector direction.
        plt.scatter(xy[0], xy[1], s=80)  # mark each endpoint.
        plt.text(xy[0] + 0.02, xy[1] + 0.02, word, fontsize=10)  # label each word.
    plt.axhline(0, color="black", linewidth=0.7)  # draw the horizontal axis.
    plt.axvline(0, color="black", linewidth=0.7)  # draw the vertical axis.
    plt.title(title)  # set the plot title.
    plt.xlabel("dimension 1")  # label the first coordinate.
    plt.ylabel("dimension 2")  # label the second coordinate.
    plt.show()  # render the vector diagram.

def project_2d(vectors, method="pca", perplexity=5):  # define PCA or t-SNE projection.
    if method == "tsne":  # choose t-SNE when requested.
        model = TSNE(n_components=2, perplexity=perplexity, init="pca", learning_rate="auto", random_state=23024)  # configure deterministic small-data t-SNE.
        return model.fit_transform(vectors)  # fit and return t-SNE coordinates.
    model = PCA(n_components=2, random_state=23024)  # configure deterministic PCA.
    return model.fit_transform(vectors)  # fit and return PCA coordinates.

def plot_labeled_map(coords, words, title, highlight=None):  # define a labeled map plot.
    plt.figure(figsize=(8, 6))  # create a readable map.
    for word, xy in zip(words, coords):  # draw each projected word.
        color = "crimson" if highlight and word in highlight else "steelblue"  # choose highlight color when needed.
        plt.scatter(xy[0], xy[1], s=70, color=color, alpha=0.85)  # plot the word point.
        plt.text(xy[0] + 0.02, xy[1] + 0.02, word, fontsize=9)  # label the word point.
    plt.axhline(0, color="black", linewidth=0.6)  # draw a horizontal reference line.
    plt.axvline(0, color="black", linewidth=0.6)  # draw a vertical reference line.
    plt.title(title)  # title the visualization.
    plt.xlabel("projected dimension 1")  # label the first projection axis.
    plt.ylabel("projected dimension 2")  # label the second projection axis.
    plt.show()  # render the map.

def train_skipgram_negative_sampling(sentences, dim=8, window=2, epochs=160, learning_rate=0.045, negatives=4):  # train tiny skip-gram embeddings from scratch.
    words, word_to_idx, idx_to_word, counts = build_vocab(sentences)  # build the vocabulary.
    pairs, word_pairs = make_skipgram_pairs(sentences, word_to_idx, window=window)  # build positive center-context pairs.
    vocab_size = len(words)  # store the vocabulary size.
    counts_array = np.array([counts[word] for word in words], dtype=float)  # turn counts into an array.
    noise_probs = counts_array ** 0.75  # use the word2vec negative-sampling noise heuristic.
    noise_probs = noise_probs / noise_probs.sum()  # normalize the negative-sampling distribution.
    center_vectors = RNG.normal(0, 0.10, size=(vocab_size, dim))  # initialize center embeddings.
    context_vectors = RNG.normal(0, 0.10, size=(vocab_size, dim))  # initialize context embeddings.
    losses = []  # store average loss by epoch.
    pair_indices = np.arange(len(pairs))  # create indices for shuffling positive pairs.
    for epoch in range(epochs):  # run SGD for several epochs.
        RNG.shuffle(pair_indices)  # shuffle positive pair order each epoch.
        total_loss = 0.0  # reset epoch loss.
        for pair_index in pair_indices:  # process one positive pair at a time.
            center_idx, context_idx = pairs[pair_index]  # unpack center and context indices.
            samples = [context_idx]  # start with the observed positive target.
            labels = [1.0]  # label the observed target as real.
            while len(samples) < negatives + 1:  # sample the requested number of negative targets.
                neg_idx = int(RNG.choice(vocab_size, p=noise_probs))  # draw one negative target.
                if neg_idx != context_idx:  # avoid labeling the true context as negative.
                    samples.append(neg_idx)  # add the negative target.
                    labels.append(0.0)  # label it as noise.
            center_old = center_vectors[center_idx].copy()  # copy the center vector before updates.
            grad_center = np.zeros(dim)  # accumulate the center-vector gradient.
            for target_idx, label in zip(samples, labels):  # update for positive and negative sampled targets.
                score = float(np.dot(center_old, context_vectors[target_idx]))  # compute the binary classifier logit.
                pred = sigmoid(score)  # convert the logit into a probability.
                error = pred - label  # compute the logistic gradient term.
                total_loss += -label * np.log(pred + 1e-12) - (1.0 - label) * np.log(1.0 - pred + 1e-12)  # add binary cross-entropy.
                grad_center += error * context_vectors[target_idx]  # add this target's contribution to the center gradient.
                context_vectors[target_idx] -= learning_rate * error * center_old  # update the target/context vector.
            center_vectors[center_idx] -= learning_rate * grad_center  # update the center vector once per sampled set.
        losses.append(total_loss / (len(pairs) * (negatives + 1)))  # store average binary loss.
    final_vectors = (center_vectors + context_vectors) / 2.0  # combine center and context vectors.
    return final_vectors, word_to_idx, idx_to_word, pd.Series(losses, name="loss"), word_pairs  # return all learned artifacts.

def build_cooccurrence(sentences, word_to_idx, window=2):  # build a GloVe-style co-occurrence matrix.
    X = np.zeros((len(word_to_idx), len(word_to_idx)), dtype=float)  # initialize the count matrix.
    for sentence in sentences:  # process each sentence.
        tokens = [token for token in tokenize(sentence) if token in word_to_idx]  # keep vocabulary tokens.
        for i, center in enumerate(tokens):  # choose each word as a target row.
            for j in range(max(0, i - window), min(len(tokens), i + window + 1)):  # scan nearby context positions.
                if i != j:  # skip the target word itself.
                    X[word_to_idx[center], word_to_idx[tokens[j]]] += 1.0 / abs(i - j)  # add inverse-distance co-occurrence weight.
    return X  # return the weighted co-occurrence matrix.

def train_tiny_glove(X, dim=8, epochs=220, learning_rate=0.035, x_max=4.0, alpha=0.75):  # optimize a tiny GloVe model.
    n = X.shape[0]  # read the vocabulary size.
    W = RNG.normal(0, 0.10, size=(n, dim))  # initialize target vectors.
    C = RNG.normal(0, 0.10, size=(n, dim))  # initialize context vectors.
    bW = np.zeros(n)  # initialize target biases.
    bC = np.zeros(n)  # initialize context biases.
    rows, cols = np.nonzero(X)  # train only on observed entries.
    losses = []  # store average reconstruction loss.
    for epoch in range(epochs):  # run SGD over observed co-occurrences.
        order = RNG.permutation(len(rows))  # shuffle observed matrix entries.
        total = 0.0  # reset epoch loss.
        for entry in order:  # visit one observed co-occurrence.
            i = rows[entry]  # read target index.
            j = cols[entry]  # read context index.
            x = X[i, j]  # read co-occurrence weight.
            weight = (x / x_max) ** alpha if x < x_max else 1.0  # compute the GloVe weighting function.
            pred = float(W[i] @ C[j] + bW[i] + bC[j])  # predict log co-occurrence.
            err = pred - np.log(x)  # compare prediction to log count.
            total += 0.5 * weight * err ** 2  # accumulate weighted squared error.
            grad = weight * err  # compute the scalar gradient multiplier.
            Wi = W[i].copy()  # preserve the old target vector.
            Cj = C[j].copy()  # preserve the old context vector.
            W[i] -= learning_rate * grad * Cj  # update target vector.
            C[j] -= learning_rate * grad * Wi  # update context vector.
            bW[i] -= learning_rate * grad  # update target bias.
            bC[j] -= learning_rate * grad  # update context bias.
        losses.append(total / max(1, len(rows)))  # store average loss over observed entries.
    return (W + C) / 2.0, pd.Series(losses, name="glove_loss")  # return final embeddings and loss trace.
```

### Data — swappable sources

Choose a tiny built-in text corpus or the tiny predefined embedding matrix. The `bank_failure` option is intentionally included because single-vector embeddings cannot represent both meanings of `bank` cleanly.

```python
DATA_SOURCE = "toy_corpus"  # choose "toy_corpus", "mini_glove", or "bank_failure".
if DATA_SOURCE == "toy_corpus":  # use raw sentences for training examples.
    active_sentences = TOY_SENTENCES  # select the full tiny corpus.
    active_words, active_w2i, active_i2w, active_counts = build_vocab(active_sentences)  # build vocabulary artifacts.
    print(f"Using toy corpus with {len(active_sentences)} sentences and {len(active_words)} vocabulary words.")  # summarize the corpus size.
elif DATA_SOURCE == "mini_glove":  # use the predefined vectors for analogy and neighborhood examples.
    active_sentences = []  # no raw sentences are needed for the predefined vector source.
    active_words = MINI_WORDS  # use predefined vocabulary words.
    active_w2i = {word: i for i, word in enumerate(MINI_WORDS)}  # create word-to-index mapping.
    active_i2w = {i: word for word, i in active_w2i.items()}  # create index-to-word mapping.
    active_counts = {word: 1 for word in active_words}  # assign dummy counts for display.
    print(f"Using mini predefined embeddings with shape {MINI_VECTORS.shape}.")  # summarize the vector matrix.
elif DATA_SOURCE == "bank_failure":  # use sentences that expose OOV and polysemy limitations.
    active_sentences = ["river bank water shore", "money bank loan account", "newtoken appears nowhere"]  # create a tiny failure-focused corpus.
    active_words, active_w2i, active_i2w, active_counts = build_vocab(active_sentences)  # build vocabulary artifacts.
    print(f"Using failure corpus with words: {active_words}.")  # print the failure vocabulary.
else:  # guard against misspelled data-source names.
    raise ValueError("DATA_SOURCE must be 'toy_corpus', 'mini_glove', or 'bank_failure'.")  # raise a clear error.
```

```python
count_table = pd.DataFrame({"word": list(active_counts.keys()), "count": list(active_counts.values())}).sort_values(["count", "word"], ascending=[False, True])  # create a frequency table.
display(count_table.head(12))  # show the most frequent words without flooding the notebook.
print("Example sentences:")  # introduce the raw text preview.
for sentence in (active_sentences[:4] if active_sentences else TOY_SENTENCES[:4]):  # print a few sentences or fallback examples.
    print(" •", sentence)  # display each sentence with a bullet.
```

```python
preview_words = ["king", "queen", "cat", "computer", "bank"]  # choose a few words to visualize from the predefined matrix.
preview_w2i = {word: i for i, word in enumerate(MINI_WORDS)}  # create a mapping for the predefined vocabulary.
preview_coords = project_2d(np.array([MINI[word] for word in preview_words]), method="pca")  # project selected vectors with PCA.
plot_labeled_map(preview_coords, preview_words, "Data preview: tiny predefined vectors in 2-D", highlight=["bank"])  # show the preview map.
```

▶ What you'll see: royalty, animal, technology, and the ambiguous `bank` point; `bank` is highlighted because it will become a failure case later.

### 📖 Concept walkthrough — build each idea from scratch

Before the warm-up examples, we build the word-embedding ideas from scratch, one small step at a time. Each concept explains not just *what* the code does but *why* this code and *why* this logic. Everything here uses only NumPy + Matplotlib and tiny inline data, so every lookup, probability, count, and cosine score is inspectable. Variables carry a `_w` suffix so they never collide with the examples below.

```python
import numpy as np  # NumPy gives us one-hot vectors, matrix lookup, dot products, softmax, and cosine similarity.
import matplotlib.pyplot as plt  # Matplotlib lets us inspect tiny embedding spaces and probability changes visually.
np.random.seed(23024)  # fix the seed so every printed value and plot in this walkthrough is reproducible.
```

#### 1. One-hot → dense lookup: the embedding matrix is the lookup table

A one-hot vector stores only an identity: one position is $1$ and every other position is $0$. Multiplying that one-hot row by an embedding matrix $E$ selects exactly one row of $E$, so the matrix itself is the lookup table. We build the multiplication by hand because it shows why dense vectors beat sparse one-hot IDs: dense coordinates can share geometry, while one-hot vectors say every different word is equally unrelated.

```python
vocab_lookup_w = ["cat", "dog", "king", "queen"]  # define a tiny vocabulary whose row order will index the table.
word_lookup_w = "king"  # choose one word to retrieve from the table.
index_lookup_w = vocab_lookup_w.index(word_lookup_w)  # find the row position assigned to the chosen word.
one_hot_lookup_w = np.zeros(len(vocab_lookup_w))  # start with a sparse all-zero one-hot row.
one_hot_lookup_w[index_lookup_w] = 1.0  # put the single 1 at the chosen word's vocabulary index.
print("vocabulary:", vocab_lookup_w)  # inspect the index order used by the lookup table.
print("one-hot for", word_lookup_w, ":", one_hot_lookup_w)  # inspect the sparse identity code.
```
▶ What you'll see: `king` is represented by a length-4 vector with a single 1 in the `king` slot.

```python
E_lookup_w = np.array([[0.90, 0.10], [0.82, 0.18], [-0.35, 0.95], [-0.28, 0.88]])  # create one dense 2-D row per word.
embedding_lookup_w = one_hot_lookup_w @ E_lookup_w  # multiply the one-hot row by E to select exactly one dense row.
print("embedding matrix E (rows are words):\n", E_lookup_w)  # inspect the full lookup table.
print("looked-up embedding:", embedding_lookup_w)  # inspect the dense vector selected by the one-hot row.
print("same as E[row]?:", np.allclose(embedding_lookup_w, E_lookup_w[index_lookup_w]))  # verify selection equals direct row indexing.
```
The product works because $o_wE=0E_{0,:}+0E_{1,:}+1E_{2,:}+0E_{3,:}=E_{2,:}$. The zeros erase every other row, and the single one keeps only the target row.
▶ What you'll see: matrix multiplication and direct row indexing return the same `king` vector.

```python
plt.figure(figsize=(5.0, 4.0))  # create a compact 2-D embedding plot.
plt.scatter(E_lookup_w[:, 0], E_lookup_w[:, 1], s=80, c=["tab:blue", "tab:blue", "tab:orange", "tab:orange"])  # draw every dense row as a point.
for label_lookup_w, vector_lookup_w in zip(vocab_lookup_w, E_lookup_w):  # loop through words and vectors for readable labels.
    plt.text(vector_lookup_w[0] + 0.015, vector_lookup_w[1] + 0.015, label_lookup_w)  # place each word label beside its point.
plt.scatter(embedding_lookup_w[0], embedding_lookup_w[1], s=220, facecolors="none", edgecolors="black", linewidths=2.0, label="lookup result")  # highlight the selected vector.
plt.axhline(0.0, color="gray", lw=0.8)  # add a horizontal reference line for orientation.
plt.axvline(0.0, color="gray", lw=0.8)  # add a vertical reference line for orientation.
plt.xlabel("dense coordinate 1")  # label the first learned coordinate.
plt.ylabel("dense coordinate 2")  # label the second learned coordinate.
plt.title("1: one-hot row selects one embedding row")  # title the required subsection figure.
plt.legend(loc="best")  # identify the highlighted lookup result.
plt.show()  # render the dense lookup geometry.
```
▶ What you'll see: `cat` and `dog` sit near each other, `king` and `queen` sit near each other, and the looked-up row is highlighted.

*Why it's done this way: the one-hot vector keeps the external word ID simple, while $E$ stores all learnable meaning in a compact dense table that nearby-context words can share.*

#### 2. word2vec skip-gram: predict nearby words from a center word

Skip-gram learns from local windows: given a center word, it tries to predict an observed nearby context word. The score for context $j$ is a dot product $\theta_j^\top e_c$, and a stable softmax turns all scores into probabilities:

$$
P(j\mid c)=\frac{\exp(\theta_j^\top e_c)}{\sum_k \exp(\theta_k^\top e_c)}
$$

We make one gradient-ish update by hand because it reveals the learning signal: increasing the true context dot product pulls co-occurring vectors together, while the softmax competition pushes probability away from alternatives.

```python
vocab_sg_w = ["king", "queen", "dog", "crown"]  # define a small vocabulary for one skip-gram prediction.
center_sg_w = "king"  # choose the center word from a tiny local window.
true_context_sg_w = "queen"  # choose the nearby word that the center should predict.
center_index_sg_w = vocab_sg_w.index(center_sg_w)  # find the center index.
true_index_sg_w = vocab_sg_w.index(true_context_sg_w)  # find the target context index.
E_sg_w = np.array([[0.20, 0.90], [0.10, 0.85], [0.85, 0.05], [0.30, 0.70]])  # create tiny input embeddings e_c.
Theta_sg_w = np.array([[0.15, 0.80], [0.05, 0.55], [0.70, 0.10], [0.25, 0.60]])  # create tiny output context vectors theta_j.
e_center_sg_w = E_sg_w[center_index_sg_w].copy()  # select the center embedding used for prediction.
print("center embedding:", e_center_sg_w)  # inspect e_c before computing scores.
print("context matrix theta:\n", Theta_sg_w)  # inspect all candidate context vectors.
```
▶ What you'll see: the center vector and four candidate context vectors are tiny enough to inspect directly.

```python
def softmax_sg_w(scores_sg_w):  # define a stable softmax helper for the small vocabulary.
    shifted_sg_w = scores_sg_w - np.max(scores_sg_w)  # subtract the max so exp never overflows.
    exp_sg_w = np.exp(shifted_sg_w)  # exponentiate shifted scores to make positive weights.
    return exp_sg_w / np.sum(exp_sg_w)  # normalize weights into probabilities that sum to 1.
scores_before_sg_w = Theta_sg_w @ e_center_sg_w  # compute dot products theta_j^T e_c for every context candidate.
probs_before_sg_w = softmax_sg_w(scores_before_sg_w)  # convert scores into prediction probabilities.
print("dot-product scores before:", np.round(scores_before_sg_w, 3))  # inspect raw compatibility scores.
print("softmax probabilities before:", dict(zip(vocab_sg_w, np.round(probs_before_sg_w, 3))))  # inspect the distribution over context words.
print("P(true context):", round(probs_before_sg_w[true_index_sg_w], 3))  # isolate the probability assigned to the observed neighbor.
```
▶ What you'll see: the true context has a probability, but other context words still compete for mass.

```python
one_hot_target_sg_w = np.zeros(len(vocab_sg_w))  # create the one-hot target distribution for the observed context.
one_hot_target_sg_w[true_index_sg_w] = 1.0  # mark the true context as probability 1 in the training label.
learning_rate_sg_w = 0.8  # choose a visible step size for one educational update.
grad_scores_sg_w = probs_before_sg_w - one_hot_target_sg_w  # compute the softmax-cross-entropy gradient with respect to scores.
grad_center_sg_w = Theta_sg_w.T @ grad_scores_sg_w  # backpropagate score gradients into the center embedding.
grad_theta_sg_w = grad_scores_sg_w[:, None] * e_center_sg_w[None, :]  # backpropagate into every context vector row.
e_after_sg_w = e_center_sg_w - learning_rate_sg_w * grad_center_sg_w  # update the center vector to favor the true context.
Theta_after_sg_w = Theta_sg_w - learning_rate_sg_w * grad_theta_sg_w  # update context vectors using the same local example.
print("score gradient:", np.round(grad_scores_sg_w, 3))  # inspect which candidates are pushed down or pulled up.
print("center before -> after:", np.round(e_center_sg_w, 3), "->", np.round(e_after_sg_w, 3))  # inspect the center-vector movement.
```
For the true context, `probability - target` is negative, so gradient descent increases $\theta_{\text{queen}}^\top e_{\text{king}}$. For non-target words it is positive, so the update lowers their relative scores.
▶ What you'll see: the update direction explicitly favors the observed `queen` context.

```python
scores_after_sg_w = Theta_after_sg_w @ e_after_sg_w  # recompute context scores after the single update.
probs_after_sg_w = softmax_sg_w(scores_after_sg_w)  # convert updated scores into probabilities.
print("dot-product scores after:", np.round(scores_after_sg_w, 3))  # inspect updated compatibility scores.
print("softmax probabilities after:", dict(zip(vocab_sg_w, np.round(probs_after_sg_w, 3))))  # compare the updated distribution.
print("P(true context) before -> after:", round(probs_before_sg_w[true_index_sg_w], 3), "->", round(probs_after_sg_w[true_index_sg_w], 3))  # verify the desired probability rose.
```
▶ What you'll see: the probability assigned to the observed context increases after one local prediction step.

```python
x_positions_sg_w = np.arange(len(vocab_sg_w))  # create bar positions for the vocabulary.
bar_width_sg_w = 0.36  # choose a width that lets before and after bars sit side by side.
plt.figure(figsize=(6.0, 4.0))  # create a readable probability comparison figure.
plt.bar(x_positions_sg_w - bar_width_sg_w / 2.0, probs_before_sg_w, width=bar_width_sg_w, label="before")  # plot the original probabilities.
plt.bar(x_positions_sg_w + bar_width_sg_w / 2.0, probs_after_sg_w, width=bar_width_sg_w, label="after")  # plot the updated probabilities.
plt.xticks(x_positions_sg_w, vocab_sg_w)  # label each bar group with its context word.
plt.ylabel("softmax probability")  # label the probability axis.
plt.ylim(0.0, max(probs_after_sg_w.max(), probs_before_sg_w.max()) + 0.15)  # leave headroom above the largest bar.
plt.title("2: skip-gram raises the observed context probability")  # title the required subsection figure.
plt.legend(loc="best")  # show before and after labels.
plt.show()  # render the probability change.
```
▶ What you'll see: the `queen` bar rises because `king` was trained to predict its observed local neighbor.

*Why it's done this way: skip-gram turns raw text order into many small supervised tasks, and each task pulls center/context vectors together only when they actually co-occur in a local window.*

#### 3. GloVe: fit dot products to global co-occurrence counts

GloVe uses a whole-corpus co-occurrence table instead of one local prediction at a time. For nonzero count $X_{ij}$, the simplified target is

$$
w_i^\top \tilde{w}_j \approx \log(X_{ij})
$$

We build a tiny count matrix because it shows the difference from word2vec: local windows produce the counts, but GloVe then fits all counts together as global statistics.

```python
sentences_glove_w = [["king", "queen", "crown"], ["king", "crown", "palace"], ["queen", "crown", "palace"], ["dog", "pet", "home"], ["dog", "pet", "cat"]]  # create a tiny corpus as token lists.
vocab_glove_w = ["king", "queen", "crown", "palace", "dog", "pet", "cat", "home"]  # define a stable vocabulary order.
w2i_glove_w = {word_glove_w: i_glove_w for i_glove_w, word_glove_w in enumerate(vocab_glove_w)}  # map each word to its matrix index.
X_glove_w = np.zeros((len(vocab_glove_w), len(vocab_glove_w)))  # initialize a square co-occurrence count matrix.
window_glove_w = 1  # count immediate left and right neighbors only.
for sentence_glove_w in sentences_glove_w:  # scan every sentence in the tiny corpus.
    for center_pos_glove_w, center_word_glove_w in enumerate(sentence_glove_w):  # visit every center word position.
        for context_pos_glove_w in range(max(0, center_pos_glove_w - window_glove_w), min(len(sentence_glove_w), center_pos_glove_w + window_glove_w + 1)):  # restrict contexts to the local window.
            if context_pos_glove_w != center_pos_glove_w:  # skip the center word itself.
                X_glove_w[w2i_glove_w[center_word_glove_w], w2i_glove_w[sentence_glove_w[context_pos_glove_w]]] += 1.0  # add one count for this center-context pair.
print("vocabulary:", vocab_glove_w)  # inspect the row and column order.
print("co-occurrence matrix X:\n", X_glove_w.astype(int))  # inspect the global counts collected from all windows.
```
▶ What you'll see: related words such as `king`/`queen`/`crown` and `dog`/`pet` have nonzero co-occurrence counts.

```python
W_glove_w = np.array([[1.00, 0.25], [0.95, 0.30], [0.85, 0.35], [0.70, 0.45], [-0.80, 0.20], [-0.75, 0.15], [-0.70, 0.10], [-0.65, 0.05]])  # create trained-looking target vectors w_i.
C_glove_w = np.array([[0.95, 0.30], [0.90, 0.35], [0.82, 0.38], [0.65, 0.50], [-0.78, 0.22], [-0.72, 0.18], [-0.68, 0.12], [-0.62, 0.08]])  # create trained-looking context vectors w_tilde_j.
pairs_glove_w = [("king", "crown"), ("dog", "pet"), ("king", "pet"), ("queen", "palace")]  # choose a few pairs to inspect.
for left_glove_w, right_glove_w in pairs_glove_w:  # compare fitted dot products with log counts.
    i_glove_w = w2i_glove_w[left_glove_w]  # find the target row index.
    j_glove_w = w2i_glove_w[right_glove_w]  # find the context column index.
    count_glove_w = X_glove_w[i_glove_w, j_glove_w]  # read the global co-occurrence count.
    dot_glove_w = W_glove_w[i_glove_w] @ C_glove_w[j_glove_w]  # compute the model's fitted dot product.
    target_glove_w = np.log(count_glove_w) if count_glove_w > 0.0 else None  # compute log count only for observed pairs.
    print(left_glove_w, right_glove_w, "count=", int(count_glove_w), "dot=", round(dot_glove_w, 3), "log(count)=", None if target_glove_w is None else round(target_glove_w, 3))  # inspect fit values.
```
The real objective also has biases and a weighting function, but the core signal is still a dot product matching a log count. The logarithm compresses frequent pairs so a count of $100$ is not treated as one hundred times more important than a count of $1$.
▶ What you'll see: observed pairs have log-count targets, while unobserved pairs are ignored by the simplified fit.

```python
positive_mask_glove_w = X_glove_w > 0.0  # mark only pairs that contribute to the simplified objective.
log_targets_glove_w = np.zeros_like(X_glove_w)  # create a matrix for log-count targets.
log_targets_glove_w[positive_mask_glove_w] = np.log(X_glove_w[positive_mask_glove_w])  # fill log counts for observed pairs.
fitted_glove_w = W_glove_w @ C_glove_w.T  # compute every fitted dot product w_i dot w_tilde_j.
errors_glove_w = fitted_glove_w[positive_mask_glove_w] - log_targets_glove_w[positive_mask_glove_w]  # compare fitted values to targets only where counts are positive.
print("mean squared fit error on observed pairs:", round(float(np.mean(errors_glove_w ** 2)), 3))  # summarize how well the toy vectors fit.
print("number of observed pairs:", int(np.sum(positive_mask_glove_w)))  # count how many global statistics are being fit at once.
```
▶ What you'll see: GloVe evaluates all observed co-occurrence entries together, not just one center-context example.

```python
plt.figure(figsize=(6.0, 4.8))  # create a heatmap figure for the count matrix.
plt.imshow(X_glove_w, cmap="Blues")  # visualize global co-occurrence intensity.
plt.xticks(np.arange(len(vocab_glove_w)), vocab_glove_w, rotation=45, ha="right")  # label context-word columns.
plt.yticks(np.arange(len(vocab_glove_w)), vocab_glove_w)  # label target-word rows.
plt.colorbar(label="co-occurrence count")  # add a scale for the counts.
plt.title("3: GloVe starts from a global co-occurrence matrix")  # title the required subsection figure.
plt.tight_layout()  # prevent rotated labels from being clipped.
plt.show()  # render the global count heatmap.
```
▶ What you'll see: the full matrix separates royalty contexts from pet contexts before any single prediction example is chosen.

*Why it's done this way: GloVe keeps the same local-window evidence but accumulates it into a global table, so training can use corpus-level frequency ratios instead of only one sampled prediction at a time.*

#### 4. Compare, solve analogies, and visualize: geometry becomes useful

Once embeddings are trained, we compare words by direction with cosine similarity and solve analogies by vector offsets. The classic pattern is

$$
e_{\text{king}}-e_{\text{man}}+e_{\text{woman}}\approx e_{\text{queen}}
$$

We use small trained-looking 2-D vectors because the arithmetic and the scatter plot can be inspected directly. Linear offsets can encode relations when training consistently places a relation, such as gender or royalty, along a reusable direction.

```python
words_geo_w = ["man", "woman", "king", "queen", "prince", "princess", "dog", "cat"]  # define a tiny trained-looking vocabulary.
V_geo_w = np.array([[0.00, 0.00], [1.00, 0.00], [0.10, 1.00], [1.10, 1.00], [0.15, 0.78], [1.15, 0.78], [-0.70, -0.40], [-0.55, -0.30]])  # encode gender mostly on x and royalty mostly on y.
lookup_geo_w = {word_geo_w: V_geo_w[i_geo_w] for i_geo_w, word_geo_w in enumerate(words_geo_w)}  # create a dictionary from word to vector.
query_geo_w = lookup_geo_w["king"] - lookup_geo_w["man"] + lookup_geo_w["woman"]  # form the analogy query vector.
print("king - man + woman =", np.round(query_geo_w, 3))  # inspect the arithmetic result.
print("queen vector       =", lookup_geo_w["queen"])  # compare against the expected answer.
```
▶ What you'll see: the query lands near the hand-built `queen` vector.

```python
def cosine_geo_w(a_geo_w, b_geo_w):  # define cosine similarity for comparing vector directions.
    denom_geo_w = max(np.linalg.norm(a_geo_w) * np.linalg.norm(b_geo_w), 1e-12)  # guard against division by zero.
    return float((a_geo_w @ b_geo_w) / denom_geo_w)  # return the normalized dot product.
scores_geo_w = []  # collect candidate cosine scores.
for word_geo_w in words_geo_w:  # score every word in the tiny vocabulary.
    if word_geo_w not in {"king", "man", "woman"}:  # exclude the source words from the answer search.
        scores_geo_w.append((word_geo_w, cosine_geo_w(query_geo_w, lookup_geo_w[word_geo_w])))  # store each candidate score.
scores_geo_w = sorted(scores_geo_w, key=lambda item_geo_w: item_geo_w[1], reverse=True)  # rank candidates by descending cosine similarity.
print("nearest by cosine:", [(word_geo_w, round(score_geo_w, 3)) for word_geo_w, score_geo_w in scores_geo_w])  # inspect the nearest-neighbor ranking.
```
Cosine similarity uses $\frac{a\cdot b}{\lVert a\rVert\lVert b\rVert}$, so it compares direction rather than raw length. That is helpful because embedding norms can reflect frequency or training details that are not the relation we want.
▶ What you'll see: `queen` is the nearest valid answer to the analogy query.

```python
plt.figure(figsize=(6.0, 4.8))  # create a readable 2-D embedding map.
plt.scatter(V_geo_w[:, 0], V_geo_w[:, 1], s=80, c="tab:purple")  # plot all trained-looking vectors.
for word_geo_w, vector_geo_w in zip(words_geo_w, V_geo_w):  # label every point directly.
    plt.text(vector_geo_w[0] + 0.025, vector_geo_w[1] + 0.025, word_geo_w)  # write the word near its vector.
plt.scatter(query_geo_w[0], query_geo_w[1], s=230, facecolors="none", edgecolors="black", linewidths=2.0, label="king - man + woman")  # highlight the analogy query.
plt.arrow(lookup_geo_w["man"][0], lookup_geo_w["man"][1], lookup_geo_w["woman"][0] - lookup_geo_w["man"][0], lookup_geo_w["woman"][1] - lookup_geo_w["man"][1], width=0.008, color="tab:blue", length_includes_head=True)  # draw the gender offset from man to woman.
plt.arrow(lookup_geo_w["king"][0], lookup_geo_w["king"][1], lookup_geo_w["queen"][0] - lookup_geo_w["king"][0], lookup_geo_w["queen"][1] - lookup_geo_w["king"][1], width=0.008, color="tab:orange", length_includes_head=True)  # draw the parallel gender offset from king to queen.
plt.xlabel("dimension 1")  # label the horizontal embedding coordinate.
plt.ylabel("dimension 2")  # label the vertical embedding coordinate.
plt.title("4: analogy offsets and nearest neighbors")  # title the required subsection figure.
plt.legend(loc="best")  # identify the analogy query marker.
plt.axis("equal")  # keep geometric offsets visually honest.
plt.show()  # render the analogy geometry.
```
▶ What you'll see: the `man → woman` arrow is parallel to the `king → queen` arrow, and the query point lands on `queen`.

*Why it's done this way: cosine nearest neighbors make trained vectors searchable, and analogy offsets work when many examples have forced the same relation to occupy a consistent linear direction.*

### 🟢 Basics (warm-up)

#### B1. Look up one embedding with $e_w=Eo_w$

**Goal.** Show that multiplying an embedding matrix by a one-hot vector selects one word column.

```python
vocab_b1 = ["cat", "dog", "king"]  # define a three-word vocabulary.
E_b1 = np.array([[0.9, 0.8, -0.7], [0.2, 0.3, 1.0]], dtype=float)  # create a 2-by-3 embedding matrix with one column per word.
word_b1 = "king"  # choose the word to look up.
idx_b1 = vocab_b1.index(word_b1)  # find the vocabulary index for the chosen word.
one_hot_b1 = np.zeros(len(vocab_b1))  # create an all-zero one-hot vector.
one_hot_b1[idx_b1] = 1.0  # place a one at the chosen word index.
embedding_b1 = E_b1 @ one_hot_b1  # multiply by the one-hot vector to select the matching column.
print("Vocabulary:", vocab_b1)  # print the vocabulary order.
print("One-hot vector:", one_hot_b1)  # print the sparse input representation.
print("Selected embedding:", embedding_b1)  # print the dense selected column.
```

```python
plt.figure(figsize=(5.5, 4))  # create a compact matrix visualization.
plt.imshow(E_b1, cmap="Blues", aspect="auto")  # show the embedding matrix values as colored cells.
plt.axvline(idx_b1, color="crimson", linewidth=3, label=f"selected column: {word_b1}")  # highlight the selected column.
plt.xticks(range(len(vocab_b1)), vocab_b1)  # label columns by vocabulary word.
plt.yticks(range(E_b1.shape[0]), ["dim 1", "dim 2"])  # label rows by embedding dimension.
plt.colorbar(label="embedding value")  # add a colorbar for numeric values.
plt.title("B1: embedding lookup is column selection")  # title the plot.
plt.legend()  # show the selected-column label.
plt.show()  # render the matrix heatmap.
```

▶ What you'll see: the `king` column highlighted, and the printed vector equals that column.

👀 **Takeaway.** $Eo_w$ looks like matrix multiplication, but the one-hot vector makes it a simple lookup.

#### B2. Cosine similarity between two word vectors

**Goal.** Compute one cosine similarity and draw the angle it measures.

```python
cat_b2 = np.array([1.0, 0.2])  # define a toy 2-D vector for cat.
dog_b2 = np.array([0.9, 0.3])  # define a nearby toy 2-D vector for dog.
cos_b2 = cosine(cat_b2, dog_b2)  # compute cosine similarity between the two directions.
angle_b2 = np.degrees(np.arccos(np.clip(cos_b2, -1.0, 1.0)))  # convert cosine to an angle in degrees.
print(f"cosine(cat, dog) = {cos_b2:.4f}")  # print the similarity score.
print(f"angle between vectors = {angle_b2:.2f} degrees")  # print the geometric angle.
```

```python
plt.figure(figsize=(5.5, 4.5))  # create a vector-angle figure.
plt.arrow(0, 0, cat_b2[0], cat_b2[1], head_width=0.035, length_includes_head=True, color="steelblue", label="cat")  # draw the cat vector.
plt.arrow(0, 0, dog_b2[0], dog_b2[1], head_width=0.035, length_includes_head=True, color="darkorange", label="dog")  # draw the dog vector.
plt.text(cat_b2[0] + 0.03, cat_b2[1], "cat", color="steelblue")  # label the cat arrow.
plt.text(dog_b2[0] + 0.03, dog_b2[1], "dog", color="darkorange")  # label the dog arrow.
plt.xlim(0, 1.2)  # set x-limits around the arrows.
plt.ylim(0, 0.6)  # set y-limits around the arrows.
plt.title("B2: cosine similarity measures angle")  # title the plot.
plt.xlabel("dimension 1")  # label the x-axis.
plt.ylabel("dimension 2")  # label the y-axis.
plt.legend()  # identify both arrows.
plt.show()  # render the angle sketch.
```

▶ What you'll see: two arrows pointing in almost the same direction, so cosine similarity is close to $1$.

👀 **Takeaway.** Cosine ignores absolute length and focuses on direction, which is why it is standard for embedding comparison.

#### B3. Nearest neighbor in a tiny vocabulary

**Goal.** Rank three candidate words by cosine similarity to one query.

```python
words_b3 = ["cat", "dog", "computer", "query"]  # define a tiny vocabulary plus a query.
vectors_b3 = np.array([[1.0, 0.2], [0.9, 0.25], [-0.1, 1.0], [0.95, 0.22]], dtype=float)  # define simple 2-D vectors.
w2i_b3 = {word: i for i, word in enumerate(words_b3)}  # map each word to a row.
i2w_b3 = {i: word for word, i in w2i_b3.items()}  # map each row back to a word.
neighbors_b3 = nearest_neighbors("query", vectors_b3, w2i_b3, i2w_b3, top_k=3)  # rank nearest words by cosine.
display(neighbors_b3)  # display the ranked neighbor table.
```

```python
plt.figure(figsize=(5.5, 4.5))  # create a tiny scatterplot.
for word in words_b3:  # draw every word.
    xy = vectors_b3[w2i_b3[word]]  # look up the word vector.
    color = "crimson" if word == "query" else "steelblue"  # highlight the query in red.
    plt.scatter(xy[0], xy[1], s=90, color=color)  # plot the vector endpoint.
    plt.text(xy[0] + 0.02, xy[1] + 0.02, word)  # label the endpoint.
plt.title("B3: nearest neighbor by cosine")  # title the plot.
plt.xlabel("dimension 1")  # label the first coordinate.
plt.ylabel("dimension 2")  # label the second coordinate.
plt.show()  # render the tiny vocabulary map.
```

▶ What you'll see: the red query sits closest to `cat` and `dog`, while `computer` points in a different direction.

👀 **Takeaway.** A nearest-neighbor query is just cosine similarity plus sorting.


#### B4. Analogy vector $a-b+c$

**Goal.** Build one analogy query vector before doing any large search.

```python
king_b4 = MINI["king"]  # look up the toy king vector.
man_b4 = MINI["man"]  # look up the toy man vector.
woman_b4 = MINI["woman"]  # look up the toy woman vector.
query_b4 = king_b4 - man_b4 + woman_b4  # form the classic royalty analogy direction.
score_queen_b4 = cosine(query_b4, MINI["queen"])  # compare the query to queen.
score_prince_b4 = cosine(query_b4, MINI["prince"])  # compare the query to prince as a contrast.
print("query = king - man + woman")  # describe the vector arithmetic.
print(f"cosine(query, queen) = {score_queen_b4:.4f}")  # print the intended answer score.
print(f"cosine(query, prince) = {score_prince_b4:.4f}")  # print a contrast score.
```

```python
plt.figure(figsize=(5.5, 4.5))  # create a tiny analogy diagram.
for word in ["man", "woman", "king", "queen"]:  # draw the four relevant words.
    xy = MINI[word][:2]  # use the first two dimensions for an interpretable sketch.
    plt.scatter(xy[0], xy[1], s=90)  # plot the word endpoint.
    plt.text(xy[0] + 0.03, xy[1] + 0.02, word)  # label the word.
plt.arrow(MINI["man"][0], MINI["man"][1], MINI["woman"][0] - MINI["man"][0], MINI["woman"][1] - MINI["man"][1], head_width=0.035, length_includes_head=True, color="gray")  # show the gender direction.
plt.arrow(MINI["king"][0], MINI["king"][1], MINI["queen"][0] - MINI["king"][0], MINI["queen"][1] - MINI["king"][1], head_width=0.035, length_includes_head=True, color="crimson")  # show the parallel royalty direction.
plt.title("B4: analogy direction")  # title the analogy sketch.
plt.xlabel("gender-like dimension")  # label the first toy axis.
plt.ylabel("royalty-like dimension")  # label the second toy axis.
plt.show()  # render the plot.
```

▶ What you'll see: the same direction that moves man to woman also moves king toward queen.

👀 **Takeaway.** Analogy arithmetic creates a query vector from vector differences.

#### B5. Normalize one word vector

**Goal.** Make one embedding unit length so dot products become cosine comparisons.

```python
word_b5 = "computer"  # choose a word vector to normalize.
vector_b5 = MINI[word_b5]  # look up the raw vector.
norm_b5 = np.linalg.norm(vector_b5)  # compute its length.
unit_b5 = vector_b5 / norm_b5  # divide by length to get a unit vector.
print(f"raw norm({word_b5}) = {norm_b5:.4f}")  # print the original length.
print("unit vector:", np.round(unit_b5, 3))  # print the normalized vector.
print(f"unit norm = {np.linalg.norm(unit_b5):.4f}")  # verify unit length.
```

```python
plt.figure(figsize=(5, 3))  # create a compact bar chart.
plt.bar(["raw norm", "unit norm"], [norm_b5, np.linalg.norm(unit_b5)], color=["steelblue", "green"])  # compare lengths.
plt.title("B5 vector normalization")  # title the primitive.
plt.ylabel("length")  # label the y-axis.
plt.show()  # render the chart.
```

▶ What you'll see: normalization changes length to one while preserving direction.

👀 **Takeaway.** Unit vectors let a dot product measure direction similarity.

#### B6. Dot product as unnormalized similarity

**Goal.** Compute the raw alignment score used inside skip-gram and GloVe objectives.

```python
center_b6 = np.array([0.5, 1.0, -0.5])  # create a center-word embedding.
context_b6 = np.array([1.0, 0.2, -0.4])  # create a context-word vector.
dot_b6 = float(center_b6 @ context_b6)  # compute unnormalized similarity.
cos_b6 = cosine(center_b6, context_b6)  # compute cosine for comparison.
print(f"dot product = {dot_b6:.3f}")  # print raw alignment.
print(f"cosine similarity = {cos_b6:.3f}")  # print normalized alignment.
```

```python
plt.figure(figsize=(5, 3))  # create a two-bar comparison.
plt.bar(["dot", "cosine"], [dot_b6, cos_b6], color=["orange", "steelblue"])  # compare raw and normalized scores.
plt.title("B6 raw dot vs cosine")  # title the comparison.
plt.show()  # render the bars.
```

▶ What you'll see: the dot product is an alignment score, but it also depends on vector length.

👀 **Takeaway.** Many embedding losses use dot products before any nearest-neighbor normalization.

#### B7. Softmax over three context scores

**Goal.** Convert three logits into probabilities for a tiny skip-gram prediction.

```python
scores_b7 = np.array([2.0, 1.0, -0.5])  # create three unnormalized context scores.
exp_b7 = np.exp(scores_b7 - scores_b7.max())  # exponentiate stabilized scores.
probs_b7 = exp_b7 / exp_b7.sum()  # normalize into probabilities.
for word, prob in zip(["queen", "cat", "loan"], probs_b7):  # print each candidate probability.
    print(f"P({word} | center) = {prob:.3f}")  # show softmax result.
```

```python
plt.figure(figsize=(5, 3))  # create a probability chart.
plt.bar(["queen", "cat", "loan"], probs_b7, color="purple")  # plot softmax probabilities.
plt.ylim(0, 1)  # show the probability range.
plt.title("B7 softmax context probabilities")  # title the primitive.
plt.ylabel("probability")  # label the y-axis.
plt.show()  # render the chart.
```

▶ What you'll see: the largest score gets the largest probability, but all probabilities sum to one.

👀 **Takeaway.** Softmax turns competing context scores into a distribution.

#### B8. One skip-gram negative-sampling score

**Goal.** Score one center-context pair with $\sigma(\theta_t^Te_c)$.

```python
center_word_b8 = "computer"  # choose a center word.
context_word_b8 = "software"  # choose a likely context word.
center_vec_b8 = MINI[center_word_b8]  # look up the center embedding.
context_vec_b8 = MINI[context_word_b8]  # look up the context vector.
logit_b8 = float(context_vec_b8 @ center_vec_b8)  # compute the skip-gram logit.
prob_b8 = float(sigmoid(logit_b8))  # convert the logit into a positive-pair score.
print(f"logit for ({center_word_b8}, {context_word_b8}) = {logit_b8:.3f}")  # print raw pair score.
print(f"P(y=1 | pair) = {prob_b8:.3f}")  # print sigmoid probability.
```

```python
xs_b8 = np.linspace(-4, 4, 200)  # create logit values for a sigmoid curve.
plt.figure(figsize=(5, 3.5))  # create a small curve plot.
plt.plot(xs_b8, sigmoid(xs_b8), label="sigmoid")  # draw negative-sampling probability curve.
plt.scatter([logit_b8], [prob_b8], s=90, color="crimson", label="pair")  # mark the chosen pair.
plt.xlabel("dot-product logit")  # label x-axis.
plt.ylabel("positive-pair probability")  # label y-axis.
plt.title("B8 skip-gram pair score")  # title the score plot.
plt.legend()  # show legend.
plt.show()  # render the plot.
```

▶ What you'll see: related words have a positive dot product and a score above 0.5.

👀 **Takeaway.** Negative sampling is a binary classifier over word pairs.

#### B9. Average two word vectors

**Goal.** Build a tiny CBOW-style context vector by averaging context embeddings.

```python
left_b9 = MINI["king"]  # look up the left context word.
right_b9 = MINI["palace"]  # look up the right context word.
context_average_b9 = (left_b9 + right_b9) / 2.0  # average the two context vectors.
print("average context vector:", np.round(context_average_b9, 3))  # print the CBOW-style context representation.
print(f"cosine(avg, queen) = {cosine(context_average_b9, MINI['queen']):.3f}")  # compare with a related target.
```

```python
plt.figure(figsize=(5.5, 4.5))  # create a small vector plot.
for label, vec, color in [("king", left_b9, "steelblue"), ("palace", right_b9, "orange"), ("average", context_average_b9, "crimson")]:  # draw both inputs and their average.
    plt.scatter(vec[0], vec[1], s=90, color=color)  # plot endpoint.
    plt.text(vec[0] + 0.03, vec[1] + 0.02, label, color=color)  # label endpoint.
plt.title("B9 average two context vectors")  # title the CBOW primitive.
plt.xlabel("dimension 1")  # label axis.
plt.ylabel("dimension 2")  # label axis.
plt.show()  # render the plot.
```

▶ What you'll see: the average lands between the two context words.

👀 **Takeaway.** CBOW summarizes surrounding words by combining their embeddings.

#### B10. Build one tiny co-occurrence count

**Goal.** Count how often one target-context pair appears inside a small window.

```python
sentence_b10 = "king queen royal palace king crown"  # create one tiny corpus sentence.
tokens_b10 = tokenize(sentence_b10)  # tokenize the sentence with the lesson helper.
target_b10 = "king"  # choose the target word.
context_b10 = "royal"  # choose the context word to count.
window_b10 = 2  # count context words within two positions.
count_b10 = 0  # initialize the co-occurrence count.
for pos, token in enumerate(tokens_b10):  # scan every token position.
    if token == target_b10:  # only open a window around the target word.
        left = max(0, pos - window_b10)  # compute left window edge.
        right = min(len(tokens_b10), pos + window_b10 + 1)  # compute right window edge.
        count_b10 += sum(tokens_b10[j] == context_b10 for j in range(left, right) if j != pos)  # count matching context tokens.
print("tokens:", tokens_b10)  # print the tokenized sentence.
print(f"X[{target_b10}, {context_b10}] = {count_b10}")  # print the co-occurrence entry.
```

```python
plt.figure(figsize=(4.5, 3))  # create a one-cell count visualization.
plt.imshow([[count_b10]], cmap="Greens", vmin=0, vmax=2)  # show the co-occurrence cell.
plt.xticks([0], [context_b10])  # label the context column.
plt.yticks([0], [target_b10])  # label the target row.
plt.text(0, 0, str(count_b10), ha="center", va="center", fontsize=16)  # annotate the count.
plt.title("B10 one co-occurrence entry")  # title the count primitive.
plt.colorbar(label="count")  # add a count colorbar.
plt.show()  # render the heatmap.
```

▶ What you'll see: one matrix entry counts local target-context co-occurrences.

👀 **Takeaway.** GloVe starts from many simple co-occurrence counts like this one.

### 🟡 Easy Examples

#### E1. One-hot vs dense embeddings

**Goal.** Compare sparse one-hot geometry with dense vector geometry on a hand-written animal/royalty corpus.  
**Data source.** Tiny hand-written animal/royalty corpus.  
**We'll build this in 4 steps:** vocabulary, one-hot matrix, dense vectors, and a result diagram.

```python
sentences_e1 = ["king queen royal palace", "cat dog animal pet"]  # create a tiny corpus with two semantic groups.
words_e1, w2i_e1, i2w_e1, counts_e1 = build_vocab(sentences_e1)  # build the vocabulary.
one_hot_e1 = np.eye(len(words_e1))  # create one orthogonal basis vector per word.
print("Vocabulary:", words_e1)  # print the vocabulary order.
print("One-hot shape:", one_hot_e1.shape)  # print the sparse representation shape.
```

```python
dense_lookup_e1 = {"king": [0.1, 0.9], "queen": [0.2, 0.85], "royal": [0.15, 0.75], "palace": [0.3, 0.7], "cat": [0.9, 0.1], "dog": [0.85, 0.2], "animal": [0.75, 0.15], "pet": [0.7, 0.25]}  # define semantic coordinates by word.
dense_e1 = np.array([dense_lookup_e1[word] for word in words_e1], dtype=float)  # align dense vectors with the sorted vocabulary.
print("Dense embedding shape:", dense_e1.shape)  # print the dense representation shape.
print(pd.DataFrame(dense_e1, index=words_e1, columns=["dim1", "dim2"]))  # display dense coordinates.
```

```python
plt.figure(figsize=(6.5, 4.8))  # create a one-hot matrix plot.
plt.imshow(one_hot_e1, cmap="Greys", aspect="auto")  # show one-hot vectors as an identity matrix.
plt.xticks(range(len(words_e1)), words_e1, rotation=45, ha="right")  # label one-hot columns by word.
plt.yticks(range(len(words_e1)), words_e1)  # label one-hot rows by word.
plt.title("E1 step: one-hot words are orthogonal")  # title the one-hot view.
plt.colorbar(label="value")  # add a color scale.
plt.show()  # render the one-hot matrix.
```

▶ What you'll see: an identity matrix where every word is equally far from every other word.

```python
plt.figure(figsize=(6.5, 5))  # create a dense vector scatterplot.
for word, xy in zip(words_e1, dense_e1):  # draw each dense word vector.
    plt.arrow(0, 0, xy[0], xy[1], head_width=0.025, length_includes_head=True, alpha=0.6)  # show direction from origin.
    plt.scatter(xy[0], xy[1], s=80)  # mark endpoint.
    plt.text(xy[0] + 0.02, xy[1] + 0.02, word)  # label endpoint.
plt.title("E1 final: dense vectors can place related words nearby")  # title the dense view.
plt.xlabel("animal direction")  # label the first teaching axis.
plt.ylabel("royalty direction")  # label the second teaching axis.
plt.show()  # render the dense embedding diagram.
```

▶ What you'll see: royalty words cluster along one direction and animal words along another, unlike the one-hot identity matrix.

👀 **Takeaway.** One-hot vectors encode identity only; dense embeddings can encode similarity.

#### E2. Build skip-gram context pairs

**Goal.** Convert toy sentences into center/context pairs using a sliding window.  
**Data source.** Toy sentences.  
**We'll build this in 4 steps:** tokenize, choose a window, collect pairs, and draw the window.

```python
sentence_e2 = "the king and queen wear a crown"  # choose one short sentence for an inspectable window.
tokens_e2 = tokenize(sentence_e2)  # tokenize the sentence.
words_e2, w2i_e2, i2w_e2, counts_e2 = build_vocab([sentence_e2])  # build vocabulary for this sentence.
print(tokens_e2)  # print the token sequence.
```

```python
window_e2 = 2  # choose a context radius of two words.
pairs_e2, word_pairs_e2 = make_skipgram_pairs([sentence_e2], w2i_e2, window=window_e2)  # build center-context examples.
pair_table_e2 = pd.DataFrame(word_pairs_e2, columns=["center", "context"])  # convert pairs to a readable table.
display(pair_table_e2.head(12))  # show the first several center-context pairs.
```

```python
center_pos_e2 = tokens_e2.index("queen")  # focus on queen as the center word.
colors_e2 = ["lightgray"] * len(tokens_e2)  # start with neutral colors for all tokens.
colors_e2[center_pos_e2] = "crimson"  # color the center token red.
for j in range(max(0, center_pos_e2 - window_e2), min(len(tokens_e2), center_pos_e2 + window_e2 + 1)):  # visit the window around queen.
    if j != center_pos_e2:  # leave the center red.
        colors_e2[j] = "gold"  # color context tokens gold.
plt.figure(figsize=(8, 2))  # create a horizontal token diagram.
plt.bar(range(len(tokens_e2)), np.ones(len(tokens_e2)), color=colors_e2, edgecolor="black")  # draw one block per token.
plt.xticks(range(len(tokens_e2)), tokens_e2)  # label blocks with tokens.
plt.yticks([])  # hide the unimportant y-axis.
plt.title("E2 step: skip-gram window around center word 'queen'")  # title the window diagram.
plt.show()  # render the sliding-window view.
```

▶ What you'll see: `queen` highlighted as the center and its nearby words highlighted as positive context targets.

```python
center_pairs_e2 = pair_table_e2[pair_table_e2["center"] == "queen"]  # filter only pairs where queen is the center.
display(center_pairs_e2)  # display queen's training pairs.
print(f"Total positive skip-gram pairs: {len(pair_table_e2)}")  # report the number of supervised examples created from one sentence.
```

👀 **Takeaway.** Skip-gram turns unlabeled text into many small supervised examples: center word in, nearby context word out.

#### E3. Train tiny skip-gram with negative sampling

**Goal.** Learn embeddings from the toy corpus using NumPy SGD and inspect the loss and neighbors.  
**Data source.** Toy corpus.  
**We'll build this in 6 steps:** pairs, negative samples, SGD, loss curve, learned neighbors, and a 2-D map.

```python
vectors_e3, w2i_e3, i2w_e3, loss_e3, word_pairs_e3 = train_skipgram_negative_sampling(TOY_SENTENCES, dim=8, window=2, epochs=180, learning_rate=0.045, negatives=4)  # train tiny skip-gram from scratch.
print(f"Trained {vectors_e3.shape[0]} word vectors with dimension {vectors_e3.shape[1]}.")  # print learned matrix shape.
print("First five positive pairs:", word_pairs_e3[:5])  # preview the supervised pairs.
```

```python
plt.figure(figsize=(7, 4.5))  # create a training-loss figure.
plt.plot(loss_e3.values, linewidth=2.4)  # plot average negative-sampling loss over epochs.
plt.title("E3 process: skip-gram negative-sampling loss")  # title the loss curve.
plt.xlabel("epoch")  # label the training epoch axis.
plt.ylabel("average binary cross-entropy")  # label the loss axis.
plt.show()  # render the loss curve.
```

▶ What you'll see: a noisy but generally decreasing loss curve, because the toy model is learning to separate real context pairs from sampled noise.

```python
for query_e3 in ["king", "queen", "cat", "computer", "bank"]:  # inspect several semantic neighborhoods.
    print(f"Nearest neighbors for {query_e3}:")  # print the query heading.
    display(nearest_neighbors(query_e3, vectors_e3, w2i_e3, i2w_e3, top_k=5))  # display learned neighbors.
```

```python
selected_e3 = ["king", "queen", "man", "woman", "cat", "dog", "computer", "software", "bank", "river", "finance"]  # select interpretable words for mapping.
coords_e3 = project_2d(np.array([vectors_e3[w2i_e3[word]] for word in selected_e3]), method="pca")  # project learned vectors with PCA.
plot_labeled_map(coords_e3, selected_e3, "E3 final: PCA map of learned skip-gram vectors", highlight=["bank"])  # draw the learned embedding map.
```

▶ What you'll see: words from repeated contexts tend to move near one another; `bank` is pulled between river and finance contexts.

👀 **Takeaway.** Negative sampling trains embeddings by pushing observed pairs together and sampled non-pairs apart.

#### E4. CBOW predicts a missing word

**Goal.** Average context embeddings and use a softmax classifier to predict a masked center word.  
**Data source.** Short news/movie-style snippets from the toy vocabulary.  
**We'll build this in 5 steps:** context selection, averaging, scores, probabilities, and top-k predictions.

```python
context_words_e4 = ["royal", "palace", "princess", "woman"]  # choose context words around a missing target.
target_candidates_e4 = ["queen", "king", "cat", "computer", "finance"]  # choose possible center words.
w2i_mini = {word: i for i, word in enumerate(MINI_WORDS)}  # build index mapping for predefined vectors.
i2w_mini = {i: word for word, i in w2i_mini.items()}  # build inverse mapping for predefined vectors.
context_matrix_e4 = np.array([MINI[word] for word in context_words_e4])  # look up context vectors.
context_average_e4 = context_matrix_e4.mean(axis=0)  # average context vectors as CBOW does.
print("Context words:", context_words_e4)  # print the observed context.
print("Averaged context vector:", np.round(context_average_e4, 3))  # print the CBOW representation.
```

```python
candidate_vectors_e4 = np.array([MINI[word] for word in target_candidates_e4])  # look up candidate target vectors.
scores_e4 = candidate_vectors_e4 @ context_average_e4  # compute compatibility scores by dot product.
probs_e4 = np.exp(scores_e4 - scores_e4.max())  # exponentiate stabilized scores.
probs_e4 = probs_e4 / probs_e4.sum()  # normalize scores into probabilities.
pred_table_e4 = pd.DataFrame({"candidate": target_candidates_e4, "score": scores_e4, "probability": probs_e4}).sort_values("probability", ascending=False)  # create a ranked table.
display(pred_table_e4)  # display the CBOW prediction table.
```

```python
plt.figure(figsize=(7, 4.5))  # create a probability bar chart.
plt.bar(pred_table_e4["candidate"], pred_table_e4["probability"], color="steelblue")  # draw top candidate probabilities.
plt.title("E4 final: CBOW-style missing-word probabilities")  # title the prediction plot.
plt.xlabel("candidate target word")  # label candidate words.
plt.ylabel("softmax probability")  # label probability axis.
plt.show()  # render the prediction distribution.
```

▶ What you'll see: `queen` receives the largest probability because its vector matches both royalty and female context directions.

```python
coords_e4 = project_2d(np.vstack([context_average_e4, candidate_vectors_e4]), method="pca")  # project context average and candidates.
labels_e4 = ["context average"] + target_candidates_e4  # create labels for the projected points.
plot_labeled_map(coords_e4, labels_e4, "E4 process: averaged context near the predicted word", highlight=["context average", "queen"])  # draw context and candidates.
```

▶ What you'll see: the averaged context point lies closest to the best target candidate in projected space.

👀 **Takeaway.** CBOW compresses context into one vector, then chooses the target whose vector is most compatible with that average.

#### E5. Cosine similarity neighborhoods

**Goal.** Query nearest neighbors for `cat`, `computer`, and `king` in a tiny predefined GloVe-like sample.  
**Data source.** Tiny predefined embedding matrix.  
**We'll build this in 4 steps:** normalize intuition, angle diagram, neighbor tables, and a cluster map.

```python
queries_e5 = ["cat", "computer", "king"]  # choose one animal, one technology word, and one royalty word.
for query_e5 in queries_e5:  # run the same neighbor query for each word.
    print(f"Nearest neighbors for {query_e5}:")  # print a readable heading.
    display(nearest_neighbors(query_e5, MINI_VECTORS, w2i_mini, i2w_mini, top_k=5))  # display top cosine neighbors.
```

```python
angle_words_e5 = ["cat", "dog", "computer"]  # select vectors for an angle comparison.
angle_vectors_e5 = np.array([MINI[word][[2, 3]] for word in angle_words_e5])  # use animal and tech axes for a clear 2-D diagram.
angle_w2i_e5 = {word: i for i, word in enumerate(angle_words_e5)}  # create a local mapping.
plot_embedding_points(angle_words_e5, angle_vectors_e5, angle_w2i_e5, "E5 process: cat-dog angle is smaller than cat-computer angle")  # plot the angle sketch.
```

▶ What you'll see: `cat` and `dog` arrows point in nearly the same animal direction, while `computer` points along the technology direction.

```python
map_words_e5 = ["king", "queen", "prince", "princess", "cat", "dog", "kitten", "computer", "laptop", "software", "code"]  # choose clustered words.
coords_e5 = project_2d(np.array([MINI[word] for word in map_words_e5]), method="pca")  # project predefined vectors with PCA.
plot_labeled_map(coords_e5, map_words_e5, "E5 final: cosine neighborhoods form semantic clusters")  # plot the neighborhood map.
```

▶ What you'll see: royalty, animals, and technology words occupy separate neighborhoods.

👀 **Takeaway.** Cosine neighborhoods are the everyday interface to embeddings: retrieval, recommendations, analogy search, and diagnostics all start here.

### 🔴 Advanced Examples

#### A1. Build a GloVe co-occurrence matrix

**Goal.** Build weighted co-occurrence counts, train tiny GloVe vectors, and inspect learned neighborhoods.  
**Data source.** Small offline corpus standing in for a Wikipedia/text8 excerpt.  
**We'll build this in 7 steps:** vocabulary, co-occurrence, heatmap, GloVe objective, SGD, loss curve, and neighbors.

```python
words_a1, w2i_a1, i2w_a1, counts_a1 = build_vocab(TOY_SENTENCES)  # build the corpus vocabulary.
X_a1 = build_cooccurrence(TOY_SENTENCES, w2i_a1, window=2)  # build weighted co-occurrence counts.
print("Co-occurrence matrix shape:", X_a1.shape)  # print matrix shape.
print("Nonzero entries:", int(np.count_nonzero(X_a1)))  # print sparsity information.
```

```python
focus_a1 = ["king", "queen", "royal", "cat", "dog", "computer", "software", "bank", "river", "finance"]  # choose words for a readable heatmap.
focus_idx_a1 = [w2i_a1[word] for word in focus_a1]  # convert focus words to indices.
heat_a1 = X_a1[np.ix_(focus_idx_a1, focus_idx_a1)]  # slice the co-occurrence matrix.
plt.figure(figsize=(8, 6))  # create a heatmap figure.
plt.imshow(heat_a1, cmap="YlGnBu")  # show weighted co-occurrence counts.
plt.xticks(range(len(focus_a1)), focus_a1, rotation=45, ha="right")  # label context columns.
plt.yticks(range(len(focus_a1)), focus_a1)  # label target rows.
plt.colorbar(label="weighted co-occurrence")  # add a colorbar for counts.
plt.title("A1 process: weighted co-occurrence matrix")  # title the heatmap.
plt.show()  # render the co-occurrence heatmap.
```

▶ What you'll see: blocky co-occurrence structure: royalty words co-occur with royalty words, pet words with pet words, and `bank` has mixed evidence.

```python
glove_vectors_a1, glove_loss_a1 = train_tiny_glove(X_a1, dim=8, epochs=260, learning_rate=0.035)  # train tiny GloVe vectors from counts.
print("Final average GloVe loss:", round(float(glove_loss_a1.iloc[-1]), 4))  # print the final reconstruction loss.
```

```python
plt.figure(figsize=(7, 4.5))  # create a GloVe loss curve.
plt.plot(glove_loss_a1.values, linewidth=2.4, color="darkgreen")  # plot weighted reconstruction loss over epochs.
plt.title("A1 process: tiny GloVe training loss")  # title the loss plot.
plt.xlabel("epoch")  # label the epoch axis.
plt.ylabel("average weighted squared error")  # label the loss axis.
plt.show()  # render the loss curve.
```

▶ What you'll see: the reconstruction loss decreases as dot products learn to approximate log co-occurrence counts.

```python
for query_a1 in ["king", "cat", "computer", "bank"]:  # inspect GloVe neighborhoods.
    print(f"GloVe-style neighbors for {query_a1}:")  # print query heading.
    display(nearest_neighbors(query_a1, glove_vectors_a1, w2i_a1, i2w_a1, top_k=5))  # display nearest neighbors.
```

```python
coords_a1 = project_2d(np.array([glove_vectors_a1[w2i_a1[word]] for word in focus_a1]), method="pca")  # project learned GloVe vectors.
plot_labeled_map(coords_a1, focus_a1, "A1 final: PCA map of tiny GloVe vectors", highlight=["bank"])  # draw the GloVe map.
```

▶ What you'll see: GloVe neighborhoods reflect global co-occurrence blocks rather than only one local window event.

👀 **Takeaway.** GloVe makes the training target explicit: vector dot products should reconstruct log co-occurrence counts.

#### A2. t-SNE map of semantic clusters

**Goal.** Visualize semantic neighborhoods with t-SNE and compare perplexity settings.  
**Data source.** Tiny predefined GloVe-like vectors plus learned skip-gram vectors.  
**We'll build this in 7 steps:** choose words, project with PCA, run t-SNE twice, compare maps, inspect clusters, and connect to learned vectors.

```python
vectors_a2_sg, w2i_a2_sg, i2w_a2_sg, loss_a2_sg, pairs_a2_sg = train_skipgram_negative_sampling(TOY_SENTENCES, dim=8, window=2, epochs=140, learning_rate=0.045, negatives=4)  # train a fresh tiny skip-gram model for the advanced visualization section.
plt.figure(figsize=(7, 4.5))  # create a loss plot for the advanced skip-gram run.
plt.plot(loss_a2_sg.values, linewidth=2.4, color="purple")  # plot the negative-sampling loss curve.
plt.title("A2 process: advanced tiny skip-gram training loss")  # title the training curve.
plt.xlabel("epoch")  # label the epoch axis.
plt.ylabel("average binary cross-entropy")  # label the loss axis.
plt.show()  # render the advanced skip-gram loss curve.
```

▶ What you'll see: the NumPy skip-gram model learns from the same toy corpus before its vectors are projected below.

```python
words_a2 = ["king", "queen", "prince", "princess", "royal", "palace", "cat", "dog", "kitten", "puppy", "animal", "computer", "laptop", "software", "hardware", "code", "paris", "france", "rome", "italy", "tokyo", "japan", "doctor", "nurse", "engineer", "teacher"]  # select words across semantic groups.
matrix_a2 = np.array([MINI[word] for word in words_a2])  # collect predefined vectors.
coords_pca_a2 = project_2d(matrix_a2, method="pca")  # compute a deterministic PCA baseline.
plot_labeled_map(coords_pca_a2, words_a2, "A2 process: PCA baseline map of tiny embeddings")  # plot the PCA baseline.
```

▶ What you'll see: broad clusters appear, but PCA emphasizes the largest linear directions.

```python
coords_tsne3_a2 = project_2d(matrix_a2, method="tsne", perplexity=3)  # run t-SNE with a small perplexity for very local neighborhoods.
plot_labeled_map(coords_tsne3_a2, words_a2, "A2 process: t-SNE map with perplexity 3")  # plot low-perplexity t-SNE.
```

▶ What you'll see: very tight local groups such as capital-country pairs and royalty pairs.

```python
coords_tsne7_a2 = project_2d(matrix_a2, method="tsne", perplexity=7)  # run t-SNE with a larger small-data perplexity.
plot_labeled_map(coords_tsne7_a2, words_a2, "A2 final: t-SNE map with perplexity 7")  # plot higher-perplexity t-SNE.
```

▶ What you'll see: local neighborhoods remain, but cluster spacing and orientation change because t-SNE maps are not unique coordinate systems.

```python
learned_words_a2 = [word for word in words_a2 if word in w2i_a2_sg]  # keep words that exist in the advanced learned skip-gram vocabulary.
learned_matrix_a2 = np.array([vectors_a2_sg[w2i_a2_sg[word]] for word in learned_words_a2])  # collect advanced learned skip-gram vectors.
learned_coords_a2 = project_2d(learned_matrix_a2, method="tsne", perplexity=4)  # project learned vectors with t-SNE.
plot_labeled_map(learned_coords_a2, learned_words_a2, "A2 connection: t-SNE map of learned skip-gram vectors", highlight=["bank"])  # show the learned embedding map.
```

▶ What you'll see: learned vectors are noisier than predefined vectors because the corpus is tiny, but repeated contexts still create visible neighborhoods.

👀 **Takeaway.** t-SNE is a visualization lens for neighborhoods; always interpret local groupings more than exact axis values or global distances.

#### A3. Analogy arithmetic

**Goal.** Compute $e_{\text{king}}-e_{\text{man}}+e_{\text{woman}}$, rank candidate answers, and draw the analogy arrows.  
**Data source.** Tiny predefined GloVe-like vectors.  
**We'll build this in 6 steps:** define query, subtract, add, rank answers, plot arrows, and compare a geography analogy.

```python
query_vec_a3 = MINI["king"] - MINI["man"] + MINI["woman"]  # form the classic analogy vector.
scores_a3 = cosine_scores(query_vec_a3, MINI_VECTORS)  # score every predefined word by cosine to the query vector.
blocked_a3 = {"king", "man", "woman"}  # exclude input words from the answer list.
ranked_a3 = sorted([(MINI_WORDS[i], float(scores_a3[i])) for i in range(len(MINI_WORDS)) if MINI_WORDS[i] not in blocked_a3], key=lambda x: -x[1])  # rank valid candidates.
display(pd.DataFrame(ranked_a3[:8], columns=["candidate", "cosine"]))  # show top analogy answers.
```

```python
arrow_words_a3 = ["man", "woman", "king", "queen"]  # choose words for arrow visualization.
coords_a3 = project_2d(np.array([MINI[word] for word in arrow_words_a3] + [query_vec_a3]), method="pca")  # project words plus query vector.
coord_dict_a3 = {word: coords_a3[i] for i, word in enumerate(arrow_words_a3)}  # map words to projected coordinates.
coord_dict_a3["king - man + woman"] = coords_a3[-1]  # add the query vector coordinate.
plt.figure(figsize=(7, 6))  # create an analogy arrow plot.
for word, xy in coord_dict_a3.items():  # draw each word and query point.
    color = "crimson" if word == "king - man + woman" else "steelblue"  # highlight the computed query vector.
    plt.scatter(xy[0], xy[1], s=90, color=color)  # draw the point.
    plt.text(xy[0] + 0.02, xy[1] + 0.02, word, fontsize=9)  # label the point.
plt.arrow(coord_dict_a3["man"][0], coord_dict_a3["man"][1], coord_dict_a3["woman"][0] - coord_dict_a3["man"][0], coord_dict_a3["woman"][1] - coord_dict_a3["man"][1], color="darkorange", head_width=0.04, length_includes_head=True)  # draw man-to-woman direction.
plt.arrow(coord_dict_a3["king"][0], coord_dict_a3["king"][1], coord_dict_a3["queen"][0] - coord_dict_a3["king"][0], coord_dict_a3["queen"][1] - coord_dict_a3["king"][1], color="darkorange", head_width=0.04, length_includes_head=True)  # draw king-to-queen direction.
plt.title("A3 process: analogy arrows for king - man + woman")  # title the analogy plot.
plt.xlabel("projected dimension 1")  # label x-axis.
plt.ylabel("projected dimension 2")  # label y-axis.
plt.show()  # render analogy arrows.
```

▶ What you'll see: the gender direction from `man` to `woman` is approximately parallel to the direction from `king` to `queen`.

```python
geo_query_a3 = MINI["paris"] - MINI["france"] + MINI["italy"]  # form a capital-country analogy query.
geo_scores_a3 = cosine_scores(geo_query_a3, MINI_VECTORS)  # score candidates against the geography query.
geo_blocked_a3 = {"paris", "france", "italy"}  # exclude input words from the answer list.
geo_ranked_a3 = sorted([(MINI_WORDS[i], float(geo_scores_a3[i])) for i in range(len(MINI_WORDS)) if MINI_WORDS[i] not in geo_blocked_a3], key=lambda x: -x[1])  # rank geography answers.
display(pd.DataFrame(geo_ranked_a3[:6], columns=["candidate", "cosine"]))  # display top geography analogy answers.
```

👀 **Takeaway.** Analogy arithmetic works when a relationship is encoded as a consistent direction; it fails when the dataset has not learned that direction.

#### A4. Failure case — OOV and polysemy

**Goal.** Show two limitations: unseen words have no vector, and one vector for `bank` blurs river and finance senses.  
**Data source.** Mixed-domain sentences with rare words and `bank`.  
**We'll build this in 6 steps:** OOV check, two sense contexts, neighbor table, projected map, annotation, and takeaway.

```python
test_words_a4 = ["cat", "cryptozebra", "bank"]  # include one known word, one OOV word, and one polysemous word.
for word_a4 in test_words_a4:  # inspect vector availability.
    if word_a4 in w2i_mini:  # check whether the word exists in the predefined vocabulary.
        print(f"{word_a4}: vector found")  # report known word.
    else:  # handle out-of-vocabulary words.
        print(f"{word_a4}: OOV, so this lookup fails without subwords or a fallback token")  # report missing word.
```

```python
river_context_a4 = np.mean([MINI["river"], MINI["water"]], axis=0)  # average vectors for the river-bank context.
finance_context_a4 = np.mean([MINI["loan"], MINI["finance"]], axis=0)  # average vectors for the finance-bank context.
bank_vec_a4 = MINI["bank"]  # look up the single bank vector.
print("cos(bank, river context):", round(cosine(bank_vec_a4, river_context_a4), 4))  # compare bank to river sense.
print("cos(bank, finance context):", round(cosine(bank_vec_a4, finance_context_a4), 4))  # compare bank to finance sense.
```

```python
poly_words_a4 = ["river", "water", "loan", "finance", "bank"]  # choose polysemy diagnostic words.
poly_vectors_a4 = np.array([MINI[word] for word in poly_words_a4] + [river_context_a4, finance_context_a4])  # include sense averages.
poly_labels_a4 = poly_words_a4 + ["river context", "finance context"]  # label words and context averages.
poly_coords_a4 = project_2d(poly_vectors_a4, method="pca")  # project the diagnostic points.
plot_labeled_map(poly_coords_a4, poly_labels_a4, "A4 process: one 'bank' vector between two senses", highlight=["bank"])  # draw the polysemy map.
```

▶ What you'll see: `bank` sits between water-related and finance-related points instead of splitting into two separate meanings.

```python
failure_rows_a4 = [{"issue": "OOV", "example": "cryptozebra", "why it fails": "no row exists in the vocabulary"}, {"issue": "polysemy", "example": "bank", "why it fails": "one vector averages multiple meanings"}]  # create a failure summary.
display(pd.DataFrame(failure_rows_a4))  # display the failure summary table.
```

👀 **Takeaway.** Classic static embeddings are useful, but they cannot represent unseen words or context-dependent meanings without extra machinery.

#### A5. Bias and dataset effects in embeddings

**Goal.** Project profession words onto a gender direction and inspect how toy data can encode social associations.  
**Data source.** Tiny predefined embeddings plus profession/gender word lists.  
**We'll build this in 7 steps:** define gender direction, project professions, plot bars, inspect neighbors, compare neutralization, and discuss limits.

```python
gender_direction_a5 = MINI["woman"] - MINI["man"]  # define the toy gender direction.
gender_direction_a5 = gender_direction_a5 / np.linalg.norm(gender_direction_a5)  # normalize the direction for projections.
professions_a5 = ["doctor", "nurse", "engineer", "teacher", "homemaker", "programmer"]  # choose profession words.
projection_a5 = [float(MINI[word] @ gender_direction_a5) for word in professions_a5]  # project each profession onto the gender direction.
bias_table_a5 = pd.DataFrame({"profession": professions_a5, "gender_projection": projection_a5}).sort_values("gender_projection")  # create a sorted projection table.
display(bias_table_a5)  # display numeric projections.
```

```python
plt.figure(figsize=(8, 4.8))  # create a bias projection bar chart.
colors_a5 = ["steelblue" if value < 0 else "darkorange" for value in bias_table_a5["gender_projection"]]  # color negative and positive projections differently.
plt.bar(bias_table_a5["profession"], bias_table_a5["gender_projection"], color=colors_a5)  # draw profession projections.
plt.axhline(0, color="black", linewidth=0.8)  # mark the neutral line.
plt.title("A5 process: profession projection on woman - man direction")  # title the bar chart.
plt.xlabel("profession word")  # label x-axis.
plt.ylabel("projection value")  # label y-axis.
plt.xticks(rotation=30, ha="right")  # rotate labels for readability.
plt.show()  # render the projection plot.
```

▶ What you'll see: some profession vectors lean toward the toy `man` side and others toward the toy `woman` side because those coordinates were encoded in the data.

```python
for query_a5 in ["engineer", "nurse", "programmer", "homemaker"]:  # inspect nearest neighbors for bias-sensitive words.
    print(f"Neighbors for {query_a5}:")  # print the query heading.
    display(nearest_neighbors(query_a5, MINI_VECTORS, w2i_mini, i2w_mini, top_k=5))  # display nearest neighbors from the predefined matrix.
```

```python
neutralized_vectors_a5 = MINI_VECTORS.copy()  # copy the matrix so the original remains unchanged.
for word_a5 in professions_a5:  # neutralize only profession words for demonstration.
    idx_a5 = w2i_mini[word_a5]  # look up the profession index.
    component_a5 = (neutralized_vectors_a5[idx_a5] @ gender_direction_a5) * gender_direction_a5  # compute the projection component along gender.
    neutralized_vectors_a5[idx_a5] = neutralized_vectors_a5[idx_a5] - component_a5  # subtract that component from the profession vector.
neutral_projection_a5 = [float(neutralized_vectors_a5[w2i_mini[word]] @ gender_direction_a5) for word in professions_a5]  # recompute projections after neutralization.
compare_a5 = pd.DataFrame({"profession": professions_a5, "before": projection_a5, "after_demo_neutralization": neutral_projection_a5})  # create before/after table.
display(compare_a5)  # display the neutralization demonstration.
```

```python
plt.figure(figsize=(8, 4.8))  # create a before-after comparison plot.
x_a5 = np.arange(len(professions_a5))  # create bar positions.
plt.bar(x_a5 - 0.18, projection_a5, width=0.36, label="before")  # draw original projections.
plt.bar(x_a5 + 0.18, neutral_projection_a5, width=0.36, label="after demo neutralization")  # draw neutralized projections.
plt.axhline(0, color="black", linewidth=0.8)  # mark zero projection.
plt.xticks(x_a5, professions_a5, rotation=30, ha="right")  # label profession bars.
plt.title("A5 final: simple projection removal changes one measured direction")  # title the comparison.
plt.ylabel("gender-direction projection")  # label the metric.
plt.legend()  # show before/after labels.
plt.show()  # render the before-after plot.
```

▶ What you'll see: removing one measured direction drives those projection values toward zero, but this is only a teaching diagnostic, not a complete fairness solution.

👀 **Takeaway.** Embeddings inherit dataset effects. Bias diagnostics should be explicit, measured, and interpreted carefully.

### Interactive Experiment

Pick a word and inspect its nearest neighbors in the tiny predefined embedding matrix. This is the same operation used in search, retrieval, analogy checking, and embedding debugging.

```python
def show_neighbors_interactive(word="king", top_k=5):  # define the callback used by the widget.
    table = nearest_neighbors(word, MINI_VECTORS, w2i_mini, i2w_mini, top_k=top_k)  # compute nearest neighbors for the selected word.
    display(table)  # display the ranked cosine table.
    selected = [word] + table["word"].tolist()  # include the query and its returned neighbors.
    coords = project_2d(np.array([MINI[item] for item in selected]), method="pca")  # project the selected neighborhood.
    plot_labeled_map(coords, selected, f"Interactive nearest-neighbor map for '{word}'", highlight=[word])  # draw the local neighborhood.
interact(show_neighbors_interactive, word=Dropdown(options=MINI_WORDS, value="king", description="word"), top_k=IntSlider(value=5, min=2, max=8, step=1, description="top k"))  # launch the interactive controls.
```

▶ What you'll see: changing the word updates the neighbor table and the local 2-D map; words from the same semantic group usually stay close.
