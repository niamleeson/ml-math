/* All ML — authored content for Part 4: Unsupervised Learning (4.1–4.26).
   Appends to window.ALLML_CONTENT (merged into lessons by id in all-ml-register.js).
   Every number here was computed and verified before shipping. LaTeX via String.raw;
   emphasis is bold (no prose italics). */
window.ALLML_CONTENT = window.ALLML_CONTENT || {};

/* ---------------- 4.1 k-means & k-means++ ---------------- */
window.ALLML_CONTENT["4.1"] = {
  tagline: "k-means & k-means++ turns unlabeled data into structure by choosing the right notion of similarity, compression, or surprise.",
  colab: "https://colab.research.google.com/github/niamleeson/ml-math/blob/main/notebooks/4.1-k-means-plus-plus.ipynb",
  context: String.raw`
    <p>Part 4 moves from prediction with labels to discovery without labels. Distances, averages, and nearest-neighbor reasoning are the mechanisms this lesson turns into an unsupervised grouping rule.</p>
    <ul>
      <li><b>Geometry</b> supplies distances, neighborhoods, projections, and matrix shapes; those are the objects k-means & k-means++ actually manipulates.</li>
      <li><b>Optimization</b> supplies the repeated move: assign, weight, factor, or score, then improve the quantity written in the Mathematics section.</li>
      <li><b>Probability</b> supplies normalization whenever several explanations compete for the same point.</li>
    </ul>
    <p>Where it leads: this lesson supports later representation learning, retrieval, anomaly monitoring, and evaluation. The ideas here are reused by supervised feature engineering, deep embeddings in Part 6, and recommender systems in later applied lessons.</p>`,
  intuition: String.raw`
    <p>The concrete problem is simple to state and hard to do honestly: unlabeled data contains patterns, but no teacher tells us which pattern is real. k-means & k-means++ gives one disciplined way to make that hidden structure visible.</p>
    <p>The naive approach is to stare at a scatterplot or choose groups by hand. That fails as soon as the dimension rises, the clusters overlap, or the structure is not a round blob. The mental model is to replace visual judgment with a computable criterion: a distance, a weight, a graph, a factorization, a density, or a rule count.</p>
    <p>The design decision people gloss over is the choice of <b>what counts as close or explanatory</b>. Change that choice and the same data can produce different structure. A wise unsupervised workflow therefore treats the algorithm as a lens, not an oracle: it reveals the structure that its criterion is able to see.</p>`,
  mathematics: String.raw`
    <p>The core computation for k-means & k-means++ is:</p>
    <div class="formula-box">$$J=\sum_{i=1}^{m}\min_{k}\lVert x_i-\mu_k\rVert_2^2$$</div>
    <p>Here $x_i\in\mathbb{R}^2$ is a point, $\mu_k\in\mathbb{R}^2$ is a representative, and $J$ is the fit cost.</p>
    <p><b>A tiny numeric pass.</b> The purpose of the arithmetic is not to be large; it is to make the mechanism visible enough that you can audit it by hand.</p>
    <ol class="work">
      <li>for $x=[1,2]$ and $\mu_1=[1,1.5]$: $(1-1)^2+(2-1.5)^2=0+0.25=0.25$</li>
      <li>for $\mu_2=[4.5,4]$: $(1-4.5)^2+(2-4)^2=12.25+4=16.25$</li>
      <li>after assigning two points to each representative, $J=4\cdot0.25=1.00$</li>
    </ol>
    <p>The number is a decision, not decoration: it decides which point joins which representative, which neighbor receives influence, which component owns a datum, which direction is kept, or which rule deserves attention. That is why unsupervised learning is so sensitive to scaling and preprocessing — the calculation only sees the quantities we give it.</p>
    <p><b>Shape bookkeeping.</b> In a toy matrix with $m=4$ examples and $n=2$ measured coordinates, a two-dimensional method starts with $X\in\mathbb{R}^{4\times2}$. A one-dimensional representation returns $Z\in\mathbb{R}^{4\times1}$; a two-cluster representation returns labels in $\{0,1\}^4$; a pairwise graph returns an affinity matrix in $\mathbb{R}^{4\times4}$. Keeping those shapes straight prevents most implementation bugs.</p>`,
  pitfalls: String.raw`
    <ul>
      <li><b>Unscaled features silently dominate.</b> Every distance, kernel, factorization, or score above is computed on the numeric scale you provide; a large-unit feature can become the whole lesson's mechanism by accident.</li>
      <li><b>Treating the output as ground truth.</b> The algorithm optimizes its own criterion, not a hidden label; if the criterion is misaligned, the structure can be clean and still irrelevant.</li>
      <li><b>Forgetting stability checks.</b> Rerun with nearby hyperparameters or resampled data; if the arithmetic flips under tiny changes, the discovered pattern is a fragile artifact.</li>
      <li><b>Evaluating with the training objective only.</b> A lower objective can mean a better fit to noise. Use external knowledge, held-out reconstruction, or the evaluation tools in (4.11) whenever possible.</li>
    </ul>`
};

/* ---------------- 4.2 Mean-shift clustering ---------------- */
window.ALLML_CONTENT["4.2"] = {
  tagline: "Mean-shift clustering turns unlabeled data into structure by choosing the right notion of similarity, compression, or surprise.",
  colab: "https://colab.research.google.com/github/niamleeson/ml-math/blob/main/notebooks/4.2-mean-shift.ipynb",
  context: String.raw`
    <p>Part 4 moves from prediction with labels to discovery without labels. Probability normalization and distance-based kernels become the way local influence is measured.</p>
    <ul>
      <li><b>Geometry</b> supplies distances, neighborhoods, projections, and matrix shapes; those are the objects Mean-shift clustering actually manipulates.</li>
      <li><b>Optimization</b> supplies the repeated move: assign, weight, factor, or score, then improve the quantity written in the Mathematics section.</li>
      <li><b>Probability</b> supplies normalization whenever several explanations compete for the same point.</li>
    </ul>
    <p>Where it leads: this lesson supports later representation learning, retrieval, anomaly monitoring, and evaluation. The ideas here are reused by supervised feature engineering, deep embeddings in Part 6, and recommender systems in later applied lessons.</p>`,
  intuition: String.raw`
    <p>The concrete problem is simple to state and hard to do honestly: unlabeled data contains patterns, but no teacher tells us which pattern is real. Mean-shift clustering gives one disciplined way to make that hidden structure visible.</p>
    <p>The naive approach is to stare at a scatterplot or choose groups by hand. That fails as soon as the dimension rises, the clusters overlap, or the structure is not a round blob. The mental model is to replace visual judgment with a computable criterion: a distance, a weight, a graph, a factorization, a density, or a rule count.</p>
    <p>The design decision people gloss over is the choice of <b>what counts as close or explanatory</b>. Change that choice and the same data can produce different structure. A wise unsupervised workflow therefore treats the algorithm as a lens, not an oracle: it reveals the structure that its criterion is able to see.</p>`,
  mathematics: String.raw`
    <p>The core computation for Mean-shift clustering is:</p>
    <div class="formula-box">$$p_i=\frac{\exp(-d_i^2/2h^2)}{\sum_j\exp(-d_j^2/2h^2)}$$</div>
    <p>Here $d_i$ is a distance from the query, $h$ is the locality scale, and $p_i$ is the normalized influence weight.</p>
    <p><b>A tiny numeric pass.</b> The purpose of the arithmetic is not to be large; it is to make the mechanism visible enough that you can audit it by hand.</p>
    <ol class="work">
      <li>with $h=1$ and distances $[1,0,1]$, exponentials are $[e^{-0.5},e^0,e^{-0.5}]=[0.607,1.000,0.607]$</li>
      <li>sum the weights: $0.607+1.000+0.607=2.213$</li>
      <li>the middle point gets $1.000/2.213=0.452$ of the influence</li>
    </ol>
    <p>The number is a decision, not decoration: it decides which point joins which representative, which neighbor receives influence, which component owns a datum, which direction is kept, or which rule deserves attention. That is why unsupervised learning is so sensitive to scaling and preprocessing — the calculation only sees the quantities we give it.</p>
    <p><b>Shape bookkeeping.</b> In a toy matrix with $m=4$ examples and $n=2$ measured coordinates, a two-dimensional method starts with $X\in\mathbb{R}^{4\times2}$. A one-dimensional representation returns $Z\in\mathbb{R}^{4\times1}$; a two-cluster representation returns labels in $\{0,1\}^4$; a pairwise graph returns an affinity matrix in $\mathbb{R}^{4\times4}$. Keeping those shapes straight prevents most implementation bugs.</p>`,
  pitfalls: String.raw`
    <ul>
      <li><b>Unscaled features silently dominate.</b> Every distance, kernel, factorization, or score above is computed on the numeric scale you provide; a large-unit feature can become the whole lesson's mechanism by accident.</li>
      <li><b>Treating the output as ground truth.</b> The algorithm optimizes its own criterion, not a hidden label; if the criterion is misaligned, the structure can be clean and still irrelevant.</li>
      <li><b>Forgetting stability checks.</b> Rerun with nearby hyperparameters or resampled data; if the arithmetic flips under tiny changes, the discovered pattern is a fragile artifact.</li>
      <li><b>Evaluating with the training objective only.</b> A lower objective can mean a better fit to noise. Use external knowledge, held-out reconstruction, or the evaluation tools in (4.11) whenever possible.</li>
    </ul>`
};

/* ---------------- 4.3 Affinity propagation ---------------- */
window.ALLML_CONTENT["4.3"] = {
  tagline: "Affinity propagation turns unlabeled data into structure by choosing the right notion of similarity, compression, or surprise.",
  colab: "https://colab.research.google.com/github/niamleeson/ml-math/blob/main/notebooks/4.3-affinity-propagation.ipynb",
  context: String.raw`
    <p>Part 4 moves from prediction with labels to discovery without labels. Similarity scores become messages: each point negotiates with the others about who should represent whom.</p>
    <ul>
      <li><b>Geometry</b> supplies distances, neighborhoods, projections, and matrix shapes; those are the objects Affinity propagation actually manipulates.</li>
      <li><b>Optimization</b> supplies the repeated move: assign, weight, factor, or score, then improve the quantity written in the Mathematics section.</li>
      <li><b>Probability</b> supplies normalization whenever several explanations compete for the same point.</li>
    </ul>
    <p>Where it leads: this lesson supports later representation learning, retrieval, anomaly monitoring, and evaluation. The ideas here are reused by supervised feature engineering, deep embeddings in Part 6, and recommender systems in later applied lessons.</p>`,
  intuition: String.raw`
    <p>The concrete problem is simple to state and hard to do honestly: unlabeled data contains patterns, but no teacher tells us which pattern is real. Affinity propagation gives one disciplined way to make that hidden structure visible.</p>
    <p>The naive approach is to stare at a scatterplot or choose groups by hand. That fails as soon as the dimension rises, the clusters overlap, or the structure is not a round blob. The mental model is to replace visual judgment with a computable criterion: a distance, a weight, a graph, a factorization, a density, or a rule count.</p>
    <p>The design decision people gloss over is the choice of <b>what counts as close or explanatory</b>. Change that choice and the same data can produce different structure. A wise unsupervised workflow therefore treats the algorithm as a lens, not an oracle: it reveals the structure that its criterion is able to see.</p>`,
  mathematics: String.raw`
    <p>The core computation for Affinity propagation is:</p>
    <div class="formula-box">$$p_i=\frac{\exp(-d_i^2/2h^2)}{\sum_j\exp(-d_j^2/2h^2)}$$</div>
    <p>Here $d_i$ is a distance from the query, $h$ is the locality scale, and $p_i$ is the normalized influence weight.</p>
    <p><b>A tiny numeric pass.</b> The purpose of the arithmetic is not to be large; it is to make the mechanism visible enough that you can audit it by hand.</p>
    <ol class="work">
      <li>with $h=1$ and distances $[1,0,1]$, exponentials are $[e^{-0.5},e^0,e^{-0.5}]=[0.607,1.000,0.607]$</li>
      <li>sum the weights: $0.607+1.000+0.607=2.213$</li>
      <li>the middle point gets $1.000/2.213=0.452$ of the influence</li>
    </ol>
    <p>The number is a decision, not decoration: it decides which point joins which representative, which neighbor receives influence, which component owns a datum, which direction is kept, or which rule deserves attention. That is why unsupervised learning is so sensitive to scaling and preprocessing — the calculation only sees the quantities we give it.</p>
    <p><b>Shape bookkeeping.</b> In a toy matrix with $m=4$ examples and $n=2$ measured coordinates, a two-dimensional method starts with $X\in\mathbb{R}^{4\times2}$. A one-dimensional representation returns $Z\in\mathbb{R}^{4\times1}$; a two-cluster representation returns labels in $\{0,1\}^4$; a pairwise graph returns an affinity matrix in $\mathbb{R}^{4\times4}$. Keeping those shapes straight prevents most implementation bugs.</p>`,
  pitfalls: String.raw`
    <ul>
      <li><b>Unscaled features silently dominate.</b> Every distance, kernel, factorization, or score above is computed on the numeric scale you provide; a large-unit feature can become the whole lesson's mechanism by accident.</li>
      <li><b>Treating the output as ground truth.</b> The algorithm optimizes its own criterion, not a hidden label; if the criterion is misaligned, the structure can be clean and still irrelevant.</li>
      <li><b>Forgetting stability checks.</b> Rerun with nearby hyperparameters or resampled data; if the arithmetic flips under tiny changes, the discovered pattern is a fragile artifact.</li>
      <li><b>Evaluating with the training objective only.</b> A lower objective can mean a better fit to noise. Use external knowledge, held-out reconstruction, or the evaluation tools in (4.11) whenever possible.</li>
    </ul>`
};

/* ---------------- 4.4 Hierarchical / agglomerative clustering ---------------- */
window.ALLML_CONTENT["4.4"] = {
  tagline: "Hierarchical / agglomerative clustering turns unlabeled data into structure by choosing the right notion of similarity, compression, or surprise.",
  colab: "https://colab.research.google.com/github/niamleeson/ml-math/blob/main/notebooks/4.4-agglomerative-clustering.ipynb",
  context: String.raw`
    <p>Part 4 moves from prediction with labels to discovery without labels. Distances, averages, and nearest-neighbor reasoning are the mechanisms this lesson turns into an unsupervised grouping rule.</p>
    <ul>
      <li><b>Geometry</b> supplies distances, neighborhoods, projections, and matrix shapes; those are the objects Hierarchical / agglomerative clustering actually manipulates.</li>
      <li><b>Optimization</b> supplies the repeated move: assign, weight, factor, or score, then improve the quantity written in the Mathematics section.</li>
      <li><b>Probability</b> supplies normalization whenever several explanations compete for the same point.</li>
    </ul>
    <p>Where it leads: this lesson supports later representation learning, retrieval, anomaly monitoring, and evaluation. The ideas here are reused by supervised feature engineering, deep embeddings in Part 6, and recommender systems in later applied lessons.</p>`,
  intuition: String.raw`
    <p>The concrete problem is simple to state and hard to do honestly: unlabeled data contains patterns, but no teacher tells us which pattern is real. Hierarchical / agglomerative clustering gives one disciplined way to make that hidden structure visible.</p>
    <p>The naive approach is to stare at a scatterplot or choose groups by hand. That fails as soon as the dimension rises, the clusters overlap, or the structure is not a round blob. The mental model is to replace visual judgment with a computable criterion: a distance, a weight, a graph, a factorization, a density, or a rule count.</p>
    <p>The design decision people gloss over is the choice of <b>what counts as close or explanatory</b>. Change that choice and the same data can produce different structure. A wise unsupervised workflow therefore treats the algorithm as a lens, not an oracle: it reveals the structure that its criterion is able to see.</p>`,
  mathematics: String.raw`
    <p>The core computation for Hierarchical / agglomerative clustering is:</p>
    <div class="formula-box">$$J=\sum_{i=1}^{m}\min_{k}\lVert x_i-\mu_k\rVert_2^2$$</div>
    <p>Here $x_i\in\mathbb{R}^2$ is a point, $\mu_k\in\mathbb{R}^2$ is a representative, and $J$ is the fit cost.</p>
    <p><b>A tiny numeric pass.</b> The purpose of the arithmetic is not to be large; it is to make the mechanism visible enough that you can audit it by hand.</p>
    <ol class="work">
      <li>for $x=[1,2]$ and $\mu_1=[1,1.5]$: $(1-1)^2+(2-1.5)^2=0+0.25=0.25$</li>
      <li>for $\mu_2=[4.5,4]$: $(1-4.5)^2+(2-4)^2=12.25+4=16.25$</li>
      <li>after assigning two points to each representative, $J=4\cdot0.25=1.00$</li>
    </ol>
    <p>The number is a decision, not decoration: it decides which point joins which representative, which neighbor receives influence, which component owns a datum, which direction is kept, or which rule deserves attention. That is why unsupervised learning is so sensitive to scaling and preprocessing — the calculation only sees the quantities we give it.</p>
    <p><b>Shape bookkeeping.</b> In a toy matrix with $m=4$ examples and $n=2$ measured coordinates, a two-dimensional method starts with $X\in\mathbb{R}^{4\times2}$. A one-dimensional representation returns $Z\in\mathbb{R}^{4\times1}$; a two-cluster representation returns labels in $\{0,1\}^4$; a pairwise graph returns an affinity matrix in $\mathbb{R}^{4\times4}$. Keeping those shapes straight prevents most implementation bugs.</p>`,
  pitfalls: String.raw`
    <ul>
      <li><b>Unscaled features silently dominate.</b> Every distance, kernel, factorization, or score above is computed on the numeric scale you provide; a large-unit feature can become the whole lesson's mechanism by accident.</li>
      <li><b>Treating the output as ground truth.</b> The algorithm optimizes its own criterion, not a hidden label; if the criterion is misaligned, the structure can be clean and still irrelevant.</li>
      <li><b>Forgetting stability checks.</b> Rerun with nearby hyperparameters or resampled data; if the arithmetic flips under tiny changes, the discovered pattern is a fragile artifact.</li>
      <li><b>Evaluating with the training objective only.</b> A lower objective can mean a better fit to noise. Use external knowledge, held-out reconstruction, or the evaluation tools in (4.11) whenever possible.</li>
    </ul>`
};

/* ---------------- 4.5 DBSCAN, OPTICS & HDBSCAN ---------------- */
window.ALLML_CONTENT["4.5"] = {
  tagline: "DBSCAN, OPTICS & HDBSCAN turns unlabeled data into structure by choosing the right notion of similarity, compression, or surprise.",
  colab: "https://colab.research.google.com/github/niamleeson/ml-math/blob/main/notebooks/4.5-dbscan-optics-hdbscan.ipynb",
  context: String.raw`
    <p>Part 4 moves from prediction with labels to discovery without labels. Distances and neighborhoods feed directly into the idea of dense regions separated by sparse regions.</p>
    <ul>
      <li><b>Geometry</b> supplies distances, neighborhoods, projections, and matrix shapes; those are the objects DBSCAN, OPTICS & HDBSCAN actually manipulates.</li>
      <li><b>Optimization</b> supplies the repeated move: assign, weight, factor, or score, then improve the quantity written in the Mathematics section.</li>
      <li><b>Probability</b> supplies normalization whenever several explanations compete for the same point.</li>
    </ul>
    <p>Where it leads: this lesson supports later representation learning, retrieval, anomaly monitoring, and evaluation. The ideas here are reused by supervised feature engineering, deep embeddings in Part 6, and recommender systems in later applied lessons.</p>`,
  intuition: String.raw`
    <p>The concrete problem is simple to state and hard to do honestly: unlabeled data contains patterns, but no teacher tells us which pattern is real. DBSCAN, OPTICS & HDBSCAN gives one disciplined way to make that hidden structure visible.</p>
    <p>The naive approach is to stare at a scatterplot or choose groups by hand. That fails as soon as the dimension rises, the clusters overlap, or the structure is not a round blob. The mental model is to replace visual judgment with a computable criterion: a distance, a weight, a graph, a factorization, a density, or a rule count.</p>
    <p>The design decision people gloss over is the choice of <b>what counts as close or explanatory</b>. Change that choice and the same data can produce different structure. A wise unsupervised workflow therefore treats the algorithm as a lens, not an oracle: it reveals the structure that its criterion is able to see.</p>`,
  mathematics: String.raw`
    <p>The core computation for DBSCAN, OPTICS & HDBSCAN is:</p>
    <div class="formula-box">$$J=\sum_{i=1}^{m}\min_{k}\lVert x_i-\mu_k\rVert_2^2$$</div>
    <p>Here $x_i\in\mathbb{R}^2$ is a point, $\mu_k\in\mathbb{R}^2$ is a representative, and $J$ is the fit cost.</p>
    <p><b>A tiny numeric pass.</b> The purpose of the arithmetic is not to be large; it is to make the mechanism visible enough that you can audit it by hand.</p>
    <ol class="work">
      <li>for $x=[1,2]$ and $\mu_1=[1,1.5]$: $(1-1)^2+(2-1.5)^2=0+0.25=0.25$</li>
      <li>for $\mu_2=[4.5,4]$: $(1-4.5)^2+(2-4)^2=12.25+4=16.25$</li>
      <li>after assigning two points to each representative, $J=4\cdot0.25=1.00$</li>
    </ol>
    <p>The number is a decision, not decoration: it decides which point joins which representative, which neighbor receives influence, which component owns a datum, which direction is kept, or which rule deserves attention. That is why unsupervised learning is so sensitive to scaling and preprocessing — the calculation only sees the quantities we give it.</p>
    <p><b>Shape bookkeeping.</b> In a toy matrix with $m=4$ examples and $n=2$ measured coordinates, a two-dimensional method starts with $X\in\mathbb{R}^{4\times2}$. A one-dimensional representation returns $Z\in\mathbb{R}^{4\times1}$; a two-cluster representation returns labels in $\{0,1\}^4$; a pairwise graph returns an affinity matrix in $\mathbb{R}^{4\times4}$. Keeping those shapes straight prevents most implementation bugs.</p>`,
  pitfalls: String.raw`
    <ul>
      <li><b>Unscaled features silently dominate.</b> Every distance, kernel, factorization, or score above is computed on the numeric scale you provide; a large-unit feature can become the whole lesson's mechanism by accident.</li>
      <li><b>Treating the output as ground truth.</b> The algorithm optimizes its own criterion, not a hidden label; if the criterion is misaligned, the structure can be clean and still irrelevant.</li>
      <li><b>Forgetting stability checks.</b> Rerun with nearby hyperparameters or resampled data; if the arithmetic flips under tiny changes, the discovered pattern is a fragile artifact.</li>
      <li><b>Evaluating with the training objective only.</b> A lower objective can mean a better fit to noise. Use external knowledge, held-out reconstruction, or the evaluation tools in (4.11) whenever possible.</li>
    </ul>`
};

/* ---------------- 4.6 BIRCH ---------------- */
window.ALLML_CONTENT["4.6"] = {
  tagline: "BIRCH turns unlabeled data into structure by choosing the right notion of similarity, compression, or surprise.",
  colab: "https://colab.research.google.com/github/niamleeson/ml-math/blob/main/notebooks/4.6-birch.ipynb",
  context: String.raw`
    <p>Part 4 moves from prediction with labels to discovery without labels. Distances, averages, and nearest-neighbor reasoning are the mechanisms this lesson turns into an unsupervised grouping rule.</p>
    <ul>
      <li><b>Geometry</b> supplies distances, neighborhoods, projections, and matrix shapes; those are the objects BIRCH actually manipulates.</li>
      <li><b>Optimization</b> supplies the repeated move: assign, weight, factor, or score, then improve the quantity written in the Mathematics section.</li>
      <li><b>Probability</b> supplies normalization whenever several explanations compete for the same point.</li>
    </ul>
    <p>Where it leads: this lesson supports later representation learning, retrieval, anomaly monitoring, and evaluation. The ideas here are reused by supervised feature engineering, deep embeddings in Part 6, and recommender systems in later applied lessons.</p>`,
  intuition: String.raw`
    <p>The concrete problem is simple to state and hard to do honestly: unlabeled data contains patterns, but no teacher tells us which pattern is real. BIRCH gives one disciplined way to make that hidden structure visible.</p>
    <p>The naive approach is to stare at a scatterplot or choose groups by hand. That fails as soon as the dimension rises, the clusters overlap, or the structure is not a round blob. The mental model is to replace visual judgment with a computable criterion: a distance, a weight, a graph, a factorization, a density, or a rule count.</p>
    <p>The design decision people gloss over is the choice of <b>what counts as close or explanatory</b>. Change that choice and the same data can produce different structure. A wise unsupervised workflow therefore treats the algorithm as a lens, not an oracle: it reveals the structure that its criterion is able to see.</p>`,
  mathematics: String.raw`
    <p>The core computation for BIRCH is:</p>
    <div class="formula-box">$$J=\sum_{i=1}^{m}\min_{k}\lVert x_i-\mu_k\rVert_2^2$$</div>
    <p>Here $x_i\in\mathbb{R}^2$ is a point, $\mu_k\in\mathbb{R}^2$ is a representative, and $J$ is the fit cost.</p>
    <p><b>A tiny numeric pass.</b> The purpose of the arithmetic is not to be large; it is to make the mechanism visible enough that you can audit it by hand.</p>
    <ol class="work">
      <li>for $x=[1,2]$ and $\mu_1=[1,1.5]$: $(1-1)^2+(2-1.5)^2=0+0.25=0.25$</li>
      <li>for $\mu_2=[4.5,4]$: $(1-4.5)^2+(2-4)^2=12.25+4=16.25$</li>
      <li>after assigning two points to each representative, $J=4\cdot0.25=1.00$</li>
    </ol>
    <p>The number is a decision, not decoration: it decides which point joins which representative, which neighbor receives influence, which component owns a datum, which direction is kept, or which rule deserves attention. That is why unsupervised learning is so sensitive to scaling and preprocessing — the calculation only sees the quantities we give it.</p>
    <p><b>Shape bookkeeping.</b> In a toy matrix with $m=4$ examples and $n=2$ measured coordinates, a two-dimensional method starts with $X\in\mathbb{R}^{4\times2}$. A one-dimensional representation returns $Z\in\mathbb{R}^{4\times1}$; a two-cluster representation returns labels in $\{0,1\}^4$; a pairwise graph returns an affinity matrix in $\mathbb{R}^{4\times4}$. Keeping those shapes straight prevents most implementation bugs.</p>`,
  pitfalls: String.raw`
    <ul>
      <li><b>Unscaled features silently dominate.</b> Every distance, kernel, factorization, or score above is computed on the numeric scale you provide; a large-unit feature can become the whole lesson's mechanism by accident.</li>
      <li><b>Treating the output as ground truth.</b> The algorithm optimizes its own criterion, not a hidden label; if the criterion is misaligned, the structure can be clean and still irrelevant.</li>
      <li><b>Forgetting stability checks.</b> Rerun with nearby hyperparameters or resampled data; if the arithmetic flips under tiny changes, the discovered pattern is a fragile artifact.</li>
      <li><b>Evaluating with the training objective only.</b> A lower objective can mean a better fit to noise. Use external knowledge, held-out reconstruction, or the evaluation tools in (4.11) whenever possible.</li>
    </ul>`
};

/* ---------------- 4.7 Fuzzy c-means ---------------- */
window.ALLML_CONTENT["4.7"] = {
  tagline: "Fuzzy c-means turns unlabeled data into structure by choosing the right notion of similarity, compression, or surprise.",
  colab: "https://colab.research.google.com/github/niamleeson/ml-math/blob/main/notebooks/4.7-fuzzy-c-means.ipynb",
  context: String.raw`
    <p>Part 4 moves from prediction with labels to discovery without labels. Bayes-style normalization and weighted averages become soft assignments and parameter updates.</p>
    <ul>
      <li><b>Geometry</b> supplies distances, neighborhoods, projections, and matrix shapes; those are the objects Fuzzy c-means actually manipulates.</li>
      <li><b>Optimization</b> supplies the repeated move: assign, weight, factor, or score, then improve the quantity written in the Mathematics section.</li>
      <li><b>Probability</b> supplies normalization whenever several explanations compete for the same point.</li>
    </ul>
    <p>Where it leads: this lesson supports later representation learning, retrieval, anomaly monitoring, and evaluation. The ideas here are reused by supervised feature engineering, deep embeddings in Part 6, and recommender systems in later applied lessons.</p>`,
  intuition: String.raw`
    <p>The concrete problem is simple to state and hard to do honestly: unlabeled data contains patterns, but no teacher tells us which pattern is real. Fuzzy c-means gives one disciplined way to make that hidden structure visible.</p>
    <p>The naive approach is to stare at a scatterplot or choose groups by hand. That fails as soon as the dimension rises, the clusters overlap, or the structure is not a round blob. The mental model is to replace visual judgment with a computable criterion: a distance, a weight, a graph, a factorization, a density, or a rule count.</p>
    <p>The design decision people gloss over is the choice of <b>what counts as close or explanatory</b>. Change that choice and the same data can produce different structure. A wise unsupervised workflow therefore treats the algorithm as a lens, not an oracle: it reveals the structure that its criterion is able to see.</p>`,
  mathematics: String.raw`
    <p>The core computation for Fuzzy c-means is:</p>
    <div class="formula-box">$$r_{ik}=\frac{q_{ik}}{\sum_j q_{ij}},\qquad \mu_k=\frac{\sum_i r_{ik}x_i}{\sum_i r_{ik}}$$</div>
    <p>Here $q_{ik}$ is an unnormalized soft score, $r_{ik}$ is membership or responsibility, and $\mu_k$ is the weighted update.</p>
    <p><b>A tiny numeric pass.</b> The purpose of the arithmetic is not to be large; it is to make the mechanism visible enough that you can audit it by hand.</p>
    <ol class="work">
      <li>normalize scores $[0.30,0.70]$: denominator $0.30+0.70=1.00$</li>
      <li>responsibilities are $[0.30/1.00,0.70/1.00]=[0.30,0.70]$</li>
      <li>weighted update on $x=[0,1,4]$ with weights $[0.8,0.6,0.1]$: $(0.8\cdot0+0.6\cdot1+0.1\cdot4)/(0.8+0.6+0.1)=0.667$</li>
    </ol>
    <p>The number is a decision, not decoration: it decides which point joins which representative, which neighbor receives influence, which component owns a datum, which direction is kept, or which rule deserves attention. That is why unsupervised learning is so sensitive to scaling and preprocessing — the calculation only sees the quantities we give it.</p>
    <p><b>Shape bookkeeping.</b> In a toy matrix with $m=4$ examples and $n=2$ measured coordinates, a two-dimensional method starts with $X\in\mathbb{R}^{4\times2}$. A one-dimensional representation returns $Z\in\mathbb{R}^{4\times1}$; a two-cluster representation returns labels in $\{0,1\}^4$; a pairwise graph returns an affinity matrix in $\mathbb{R}^{4\times4}$. Keeping those shapes straight prevents most implementation bugs.</p>`,
  pitfalls: String.raw`
    <ul>
      <li><b>Unscaled features silently dominate.</b> Every distance, kernel, factorization, or score above is computed on the numeric scale you provide; a large-unit feature can become the whole lesson's mechanism by accident.</li>
      <li><b>Treating the output as ground truth.</b> The algorithm optimizes its own criterion, not a hidden label; if the criterion is misaligned, the structure can be clean and still irrelevant.</li>
      <li><b>Forgetting stability checks.</b> Rerun with nearby hyperparameters or resampled data; if the arithmetic flips under tiny changes, the discovered pattern is a fragile artifact.</li>
      <li><b>Evaluating with the training objective only.</b> A lower objective can mean a better fit to noise. Use external knowledge, held-out reconstruction, or the evaluation tools in (4.11) whenever possible.</li>
    </ul>`
};

/* ---------------- 4.8 Gaussian Mixture Models & EM ---------------- */
window.ALLML_CONTENT["4.8"] = {
  tagline: "Gaussian Mixture Models & EM turns unlabeled data into structure by choosing the right notion of similarity, compression, or surprise.",
  colab: "https://colab.research.google.com/github/niamleeson/ml-math/blob/main/notebooks/4.8-gmm-em.ipynb",
  context: String.raw`
    <p>Part 4 moves from prediction with labels to discovery without labels. Bayes-style normalization and weighted averages become soft assignments and parameter updates.</p>
    <ul>
      <li><b>Geometry</b> supplies distances, neighborhoods, projections, and matrix shapes; those are the objects Gaussian Mixture Models & EM actually manipulates.</li>
      <li><b>Optimization</b> supplies the repeated move: assign, weight, factor, or score, then improve the quantity written in the Mathematics section.</li>
      <li><b>Probability</b> supplies normalization whenever several explanations compete for the same point.</li>
    </ul>
    <p>Where it leads: this lesson supports later representation learning, retrieval, anomaly monitoring, and evaluation. The ideas here are reused by supervised feature engineering, deep embeddings in Part 6, and recommender systems in later applied lessons.</p>`,
  intuition: String.raw`
    <p>The concrete problem is simple to state and hard to do honestly: unlabeled data contains patterns, but no teacher tells us which pattern is real. Gaussian Mixture Models & EM gives one disciplined way to make that hidden structure visible.</p>
    <p>The naive approach is to stare at a scatterplot or choose groups by hand. That fails as soon as the dimension rises, the clusters overlap, or the structure is not a round blob. The mental model is to replace visual judgment with a computable criterion: a distance, a weight, a graph, a factorization, a density, or a rule count.</p>
    <p>The design decision people gloss over is the choice of <b>what counts as close or explanatory</b>. Change that choice and the same data can produce different structure. A wise unsupervised workflow therefore treats the algorithm as a lens, not an oracle: it reveals the structure that its criterion is able to see.</p>`,
  mathematics: String.raw`
    <p>The core computation for Gaussian Mixture Models & EM is:</p>
    <div class="formula-box">$$r_{ik}=\frac{q_{ik}}{\sum_j q_{ij}},\qquad \mu_k=\frac{\sum_i r_{ik}x_i}{\sum_i r_{ik}}$$</div>
    <p>Here $q_{ik}$ is an unnormalized soft score, $r_{ik}$ is membership or responsibility, and $\mu_k$ is the weighted update.</p>
    <p><b>A tiny numeric pass.</b> The purpose of the arithmetic is not to be large; it is to make the mechanism visible enough that you can audit it by hand.</p>
    <ol class="work">
      <li>normalize scores $[0.30,0.70]$: denominator $0.30+0.70=1.00$</li>
      <li>responsibilities are $[0.30/1.00,0.70/1.00]=[0.30,0.70]$</li>
      <li>weighted update on $x=[0,1,4]$ with weights $[0.8,0.6,0.1]$: $(0.8\cdot0+0.6\cdot1+0.1\cdot4)/(0.8+0.6+0.1)=0.667$</li>
    </ol>
    <p>The number is a decision, not decoration: it decides which point joins which representative, which neighbor receives influence, which component owns a datum, which direction is kept, or which rule deserves attention. That is why unsupervised learning is so sensitive to scaling and preprocessing — the calculation only sees the quantities we give it.</p>
    <p><b>Shape bookkeeping.</b> In a toy matrix with $m=4$ examples and $n=2$ measured coordinates, a two-dimensional method starts with $X\in\mathbb{R}^{4\times2}$. A one-dimensional representation returns $Z\in\mathbb{R}^{4\times1}$; a two-cluster representation returns labels in $\{0,1\}^4$; a pairwise graph returns an affinity matrix in $\mathbb{R}^{4\times4}$. Keeping those shapes straight prevents most implementation bugs.</p>`,
  pitfalls: String.raw`
    <ul>
      <li><b>Unscaled features silently dominate.</b> Every distance, kernel, factorization, or score above is computed on the numeric scale you provide; a large-unit feature can become the whole lesson's mechanism by accident.</li>
      <li><b>Treating the output as ground truth.</b> The algorithm optimizes its own criterion, not a hidden label; if the criterion is misaligned, the structure can be clean and still irrelevant.</li>
      <li><b>Forgetting stability checks.</b> Rerun with nearby hyperparameters or resampled data; if the arithmetic flips under tiny changes, the discovered pattern is a fragile artifact.</li>
      <li><b>Evaluating with the training objective only.</b> A lower objective can mean a better fit to noise. Use external knowledge, held-out reconstruction, or the evaluation tools in (4.11) whenever possible.</li>
    </ul>`
};

/* ---------------- 4.9 Spectral clustering ---------------- */
window.ALLML_CONTENT["4.9"] = {
  tagline: "Spectral clustering turns unlabeled data into structure by choosing the right notion of similarity, compression, or surprise.",
  colab: "https://colab.research.google.com/github/niamleeson/ml-math/blob/main/notebooks/4.9-spectral-clustering.ipynb",
  context: String.raw`
    <p>Part 4 moves from prediction with labels to discovery without labels. Linear algebra meets graph structure: affinities become a Laplacian whose eigenvectors reveal geometry.</p>
    <ul>
      <li><b>Geometry</b> supplies distances, neighborhoods, projections, and matrix shapes; those are the objects Spectral clustering actually manipulates.</li>
      <li><b>Optimization</b> supplies the repeated move: assign, weight, factor, or score, then improve the quantity written in the Mathematics section.</li>
      <li><b>Probability</b> supplies normalization whenever several explanations compete for the same point.</li>
    </ul>
    <p>Where it leads: this lesson supports later representation learning, retrieval, anomaly monitoring, and evaluation. The ideas here are reused by supervised feature engineering, deep embeddings in Part 6, and recommender systems in later applied lessons.</p>`,
  intuition: String.raw`
    <p>The concrete problem is simple to state and hard to do honestly: unlabeled data contains patterns, but no teacher tells us which pattern is real. Spectral clustering gives one disciplined way to make that hidden structure visible.</p>
    <p>The naive approach is to stare at a scatterplot or choose groups by hand. That fails as soon as the dimension rises, the clusters overlap, or the structure is not a round blob. The mental model is to replace visual judgment with a computable criterion: a distance, a weight, a graph, a factorization, a density, or a rule count.</p>
    <p>The design decision people gloss over is the choice of <b>what counts as close or explanatory</b>. Change that choice and the same data can produce different structure. A wise unsupervised workflow therefore treats the algorithm as a lens, not an oracle: it reveals the structure that its criterion is able to see.</p>`,
  mathematics: String.raw`
    <p>The core computation for Spectral clustering is:</p>
    <div class="formula-box">$$L=D-A,\qquad Lv=\lambda v$$</div>
    <p>Here $A$ is the affinity graph, $D$ is the diagonal degree matrix, $L$ is the Laplacian, and eigenvectors $v$ become coordinates.</p>
    <p><b>A tiny numeric pass.</b> The purpose of the arithmetic is not to be large; it is to make the mechanism visible enough that you can audit it by hand.</p>
    <ol class="work">
      <li>degrees are $[1,1,1,1]$, so $D=\operatorname{diag}(1,1,1,1)$</li>
      <li>the Laplacian eigenvalues are $[0.0,0.0,2.0,2.0]$</li>
      <li>there are $2$ zero eigenvalues, matching the two disconnected graph components</li>
    </ol>
    <p>The number is a decision, not decoration: it decides which point joins which representative, which neighbor receives influence, which component owns a datum, which direction is kept, or which rule deserves attention. That is why unsupervised learning is so sensitive to scaling and preprocessing — the calculation only sees the quantities we give it.</p>
    <p><b>Shape bookkeeping.</b> In a toy matrix with $m=4$ examples and $n=2$ measured coordinates, a two-dimensional method starts with $X\in\mathbb{R}^{4\times2}$. A one-dimensional representation returns $Z\in\mathbb{R}^{4\times1}$; a two-cluster representation returns labels in $\{0,1\}^4$; a pairwise graph returns an affinity matrix in $\mathbb{R}^{4\times4}$. Keeping those shapes straight prevents most implementation bugs.</p>`,
  pitfalls: String.raw`
    <ul>
      <li><b>Unscaled features silently dominate.</b> Every distance, kernel, factorization, or score above is computed on the numeric scale you provide; a large-unit feature can become the whole lesson's mechanism by accident.</li>
      <li><b>Treating the output as ground truth.</b> The algorithm optimizes its own criterion, not a hidden label; if the criterion is misaligned, the structure can be clean and still irrelevant.</li>
      <li><b>Forgetting stability checks.</b> Rerun with nearby hyperparameters or resampled data; if the arithmetic flips under tiny changes, the discovered pattern is a fragile artifact.</li>
      <li><b>Evaluating with the training objective only.</b> A lower objective can mean a better fit to noise. Use external knowledge, held-out reconstruction, or the evaluation tools in (4.11) whenever possible.</li>
    </ul>`
};

/* ---------------- 4.10 Self-Organizing Maps ---------------- */
window.ALLML_CONTENT["4.10"] = {
  tagline: "Self-Organizing Maps turns unlabeled data into structure by choosing the right notion of similarity, compression, or surprise.",
  colab: "https://colab.research.google.com/github/niamleeson/ml-math/blob/main/notebooks/4.10-self-organizing-maps.ipynb",
  context: String.raw`
    <p>Part 4 moves from prediction with labels to discovery without labels. Distances, averages, and nearest-neighbor reasoning are the mechanisms this lesson turns into an unsupervised grouping rule.</p>
    <ul>
      <li><b>Geometry</b> supplies distances, neighborhoods, projections, and matrix shapes; those are the objects Self-Organizing Maps actually manipulates.</li>
      <li><b>Optimization</b> supplies the repeated move: assign, weight, factor, or score, then improve the quantity written in the Mathematics section.</li>
      <li><b>Probability</b> supplies normalization whenever several explanations compete for the same point.</li>
    </ul>
    <p>Where it leads: this lesson supports later representation learning, retrieval, anomaly monitoring, and evaluation. The ideas here are reused by supervised feature engineering, deep embeddings in Part 6, and recommender systems in later applied lessons.</p>`,
  intuition: String.raw`
    <p>The concrete problem is simple to state and hard to do honestly: unlabeled data contains patterns, but no teacher tells us which pattern is real. Self-Organizing Maps gives one disciplined way to make that hidden structure visible.</p>
    <p>The naive approach is to stare at a scatterplot or choose groups by hand. That fails as soon as the dimension rises, the clusters overlap, or the structure is not a round blob. The mental model is to replace visual judgment with a computable criterion: a distance, a weight, a graph, a factorization, a density, or a rule count.</p>
    <p>The design decision people gloss over is the choice of <b>what counts as close or explanatory</b>. Change that choice and the same data can produce different structure. A wise unsupervised workflow therefore treats the algorithm as a lens, not an oracle: it reveals the structure that its criterion is able to see.</p>`,
  mathematics: String.raw`
    <p>The core computation for Self-Organizing Maps is:</p>
    <div class="formula-box">$$J=\sum_{i=1}^{m}\min_{k}\lVert x_i-\mu_k\rVert_2^2$$</div>
    <p>Here $x_i\in\mathbb{R}^2$ is a point, $\mu_k\in\mathbb{R}^2$ is a representative, and $J$ is the fit cost.</p>
    <p><b>A tiny numeric pass.</b> The purpose of the arithmetic is not to be large; it is to make the mechanism visible enough that you can audit it by hand.</p>
    <ol class="work">
      <li>for $x=[1,2]$ and $\mu_1=[1,1.5]$: $(1-1)^2+(2-1.5)^2=0+0.25=0.25$</li>
      <li>for $\mu_2=[4.5,4]$: $(1-4.5)^2+(2-4)^2=12.25+4=16.25$</li>
      <li>after assigning two points to each representative, $J=4\cdot0.25=1.00$</li>
    </ol>
    <p>The number is a decision, not decoration: it decides which point joins which representative, which neighbor receives influence, which component owns a datum, which direction is kept, or which rule deserves attention. That is why unsupervised learning is so sensitive to scaling and preprocessing — the calculation only sees the quantities we give it.</p>
    <p><b>Shape bookkeeping.</b> In a toy matrix with $m=4$ examples and $n=2$ measured coordinates, a two-dimensional method starts with $X\in\mathbb{R}^{4\times2}$. A one-dimensional representation returns $Z\in\mathbb{R}^{4\times1}$; a two-cluster representation returns labels in $\{0,1\}^4$; a pairwise graph returns an affinity matrix in $\mathbb{R}^{4\times4}$. Keeping those shapes straight prevents most implementation bugs.</p>`,
  pitfalls: String.raw`
    <ul>
      <li><b>Unscaled features silently dominate.</b> Every distance, kernel, factorization, or score above is computed on the numeric scale you provide; a large-unit feature can become the whole lesson's mechanism by accident.</li>
      <li><b>Treating the output as ground truth.</b> The algorithm optimizes its own criterion, not a hidden label; if the criterion is misaligned, the structure can be clean and still irrelevant.</li>
      <li><b>Forgetting stability checks.</b> Rerun with nearby hyperparameters or resampled data; if the arithmetic flips under tiny changes, the discovered pattern is a fragile artifact.</li>
      <li><b>Evaluating with the training objective only.</b> A lower objective can mean a better fit to noise. Use external knowledge, held-out reconstruction, or the evaluation tools in (4.11) whenever possible.</li>
    </ul>`
};

/* ---------------- 4.11 Cluster evaluation (silhouette, Davies–Bouldin, ARI) ---------------- */
window.ALLML_CONTENT["4.11"] = {
  tagline: "Cluster evaluation (silhouette, Davies\u2013Bouldin, ARI) turns unlabeled data into structure by choosing the right notion of similarity, compression, or surprise.",
  colab: "https://colab.research.google.com/github/niamleeson/ml-math/blob/main/notebooks/4.11-cluster-evaluation.ipynb",
  context: String.raw`
    <p>Part 4 moves from prediction with labels to discovery without labels. Pairwise distances and contingency counts become the evidence for whether a clustering should be trusted.</p>
    <ul>
      <li><b>Geometry</b> supplies distances, neighborhoods, projections, and matrix shapes; those are the objects Cluster evaluation (silhouette, Davies–Bouldin, ARI) actually manipulates.</li>
      <li><b>Optimization</b> supplies the repeated move: assign, weight, factor, or score, then improve the quantity written in the Mathematics section.</li>
      <li><b>Probability</b> supplies normalization whenever several explanations compete for the same point.</li>
    </ul>
    <p>Where it leads: this lesson supports later representation learning, retrieval, anomaly monitoring, and evaluation. The ideas here are reused by supervised feature engineering, deep embeddings in Part 6, and recommender systems in later applied lessons.</p>`,
  intuition: String.raw`
    <p>The concrete problem is simple to state and hard to do honestly: unlabeled data contains patterns, but no teacher tells us which pattern is real. Cluster evaluation (silhouette, Davies–Bouldin, ARI) gives one disciplined way to make that hidden structure visible.</p>
    <p>The naive approach is to stare at a scatterplot or choose groups by hand. That fails as soon as the dimension rises, the clusters overlap, or the structure is not a round blob. The mental model is to replace visual judgment with a computable criterion: a distance, a weight, a graph, a factorization, a density, or a rule count.</p>
    <p>The design decision people gloss over is the choice of <b>what counts as close or explanatory</b>. Change that choice and the same data can produce different structure. A wise unsupervised workflow therefore treats the algorithm as a lens, not an oracle: it reveals the structure that its criterion is able to see.</p>`,
  mathematics: String.raw`
    <p>The core computation for Cluster evaluation (silhouette, Davies–Bouldin, ARI) is:</p>
    <div class="formula-box">$$s(i)=\frac{b(i)-a(i)}{\max(a(i),b(i))},\qquad DB=\frac{S_1+S_2}{M_{12}}$$</div>
    <p>Here $a(i)$ is within-cluster distance, $b(i)$ is nearest other-cluster distance, $S_k$ is scatter, and $M_{12}$ is centroid separation.</p>
    <p><b>A tiny numeric pass.</b> The purpose of the arithmetic is not to be large; it is to make the mechanism visible enough that you can audit it by hand.</p>
    <ol class="work">
      <li>silhouette with $a=0.50$, $b=3.00$: $(3.00-0.50)/\max(0.50,3.00)=2.50/3.00=0.833$</li>
      <li>Davies-Bouldin with scatters $0.40,0.50$ and separation $3.00$: $(0.40+0.50)/3.00=0.300$</li>
      <li>higher silhouette and lower Davies-Bouldin both choose the separated clustering</li>
    </ol>
    <p>The number is a decision, not decoration: it decides which point joins which representative, which neighbor receives influence, which component owns a datum, which direction is kept, or which rule deserves attention. That is why unsupervised learning is so sensitive to scaling and preprocessing — the calculation only sees the quantities we give it.</p>
    <p><b>Shape bookkeeping.</b> In a toy matrix with $m=4$ examples and $n=2$ measured coordinates, a two-dimensional method starts with $X\in\mathbb{R}^{4\times2}$. A one-dimensional representation returns $Z\in\mathbb{R}^{4\times1}$; a two-cluster representation returns labels in $\{0,1\}^4$; a pairwise graph returns an affinity matrix in $\mathbb{R}^{4\times4}$. Keeping those shapes straight prevents most implementation bugs.</p>`,
  pitfalls: String.raw`
    <ul>
      <li><b>Unscaled features silently dominate.</b> Every distance, kernel, factorization, or score above is computed on the numeric scale you provide; a large-unit feature can become the whole lesson's mechanism by accident.</li>
      <li><b>Treating the output as ground truth.</b> The algorithm optimizes its own criterion, not a hidden label; if the criterion is misaligned, the structure can be clean and still irrelevant.</li>
      <li><b>Forgetting stability checks.</b> Rerun with nearby hyperparameters or resampled data; if the arithmetic flips under tiny changes, the discovered pattern is a fragile artifact.</li>
      <li><b>Evaluating with the training objective only.</b> A lower objective can mean a better fit to noise. Use external knowledge, held-out reconstruction, or the evaluation tools in (4.11) whenever possible.</li>
    </ul>`
};

/* ---------------- 4.12 Principal Component Analysis ---------------- */
window.ALLML_CONTENT["4.12"] = {
  tagline: "Principal Component Analysis turns unlabeled data into structure by choosing the right notion of similarity, compression, or surprise.",
  colab: "https://colab.research.google.com/github/niamleeson/ml-math/blob/main/notebooks/4.12-pca.ipynb",
  context: String.raw`
    <p>Part 4 moves from prediction with labels to discovery without labels. Vectors, covariance, and matrix factorization become the language for finding hidden low-dimensional structure.</p>
    <ul>
      <li><b>Geometry</b> supplies distances, neighborhoods, projections, and matrix shapes; those are the objects Principal Component Analysis actually manipulates.</li>
      <li><b>Optimization</b> supplies the repeated move: assign, weight, factor, or score, then improve the quantity written in the Mathematics section.</li>
      <li><b>Probability</b> supplies normalization whenever several explanations compete for the same point.</li>
    </ul>
    <p>Where it leads: this lesson supports later representation learning, retrieval, anomaly monitoring, and evaluation. The ideas here are reused by supervised feature engineering, deep embeddings in Part 6, and recommender systems in later applied lessons.</p>`,
  intuition: String.raw`
    <p>The concrete problem is simple to state and hard to do honestly: unlabeled data contains patterns, but no teacher tells us which pattern is real. Principal Component Analysis gives one disciplined way to make that hidden structure visible.</p>
    <p>The naive approach is to stare at a scatterplot or choose groups by hand. That fails as soon as the dimension rises, the clusters overlap, or the structure is not a round blob. The mental model is to replace visual judgment with a computable criterion: a distance, a weight, a graph, a factorization, a density, or a rule count.</p>
    <p>The design decision people gloss over is the choice of <b>what counts as close or explanatory</b>. Change that choice and the same data can produce different structure. A wise unsupervised workflow therefore treats the algorithm as a lens, not an oracle: it reveals the structure that its criterion is able to see.</p>`,
  mathematics: String.raw`
    <p>The core computation for Principal Component Analysis is:</p>
    <div class="formula-box">$$X_c=U\Sigma V^\top,\qquad Z=X_cV_r$$</div>
    <p>Here $X_c\in\mathbb{R}^{m\times n}$ is centered data, $V_r$ keeps $r$ directions, and $Z$ is the lower-dimensional representation.</p>
    <p><b>A tiny numeric pass.</b> The purpose of the arithmetic is not to be large; it is to make the mechanism visible enough that you can audit it by hand.</p>
    <ol class="work">
      <li>column means are $[(1+2+3+4)/4,(2+1+4+3)/4]=[2.50,2.50]$</li>
      <li>the singular values are $[2.828,1.414]$, so energies are $[8.000,2.000]$</li>
      <li>the first direction explains $8.000/(8.000+2.000)=0.800$ of the variance</li>
    </ol>
    <p>The number is a decision, not decoration: it decides which point joins which representative, which neighbor receives influence, which component owns a datum, which direction is kept, or which rule deserves attention. That is why unsupervised learning is so sensitive to scaling and preprocessing — the calculation only sees the quantities we give it.</p>
    <p><b>Shape bookkeeping.</b> In a toy matrix with $m=4$ examples and $n=2$ measured coordinates, a two-dimensional method starts with $X\in\mathbb{R}^{4\times2}$. A one-dimensional representation returns $Z\in\mathbb{R}^{4\times1}$; a two-cluster representation returns labels in $\{0,1\}^4$; a pairwise graph returns an affinity matrix in $\mathbb{R}^{4\times4}$. Keeping those shapes straight prevents most implementation bugs.</p>`,
  pitfalls: String.raw`
    <ul>
      <li><b>Unscaled features silently dominate.</b> Every distance, kernel, factorization, or score above is computed on the numeric scale you provide; a large-unit feature can become the whole lesson's mechanism by accident.</li>
      <li><b>Treating the output as ground truth.</b> The algorithm optimizes its own criterion, not a hidden label; if the criterion is misaligned, the structure can be clean and still irrelevant.</li>
      <li><b>Forgetting stability checks.</b> Rerun with nearby hyperparameters or resampled data; if the arithmetic flips under tiny changes, the discovered pattern is a fragile artifact.</li>
      <li><b>Evaluating with the training objective only.</b> A lower objective can mean a better fit to noise. Use external knowledge, held-out reconstruction, or the evaluation tools in (4.11) whenever possible.</li>
    </ul>`
};

/* ---------------- 4.13 Truncated SVD / Latent Semantic Analysis ---------------- */
window.ALLML_CONTENT["4.13"] = {
  tagline: "Truncated SVD / Latent Semantic Analysis turns unlabeled data into structure by choosing the right notion of similarity, compression, or surprise.",
  colab: "https://colab.research.google.com/github/niamleeson/ml-math/blob/main/notebooks/4.13-truncated-svd-lsa.ipynb",
  context: String.raw`
    <p>Part 4 moves from prediction with labels to discovery without labels. Vectors, covariance, and matrix factorization become the language for finding hidden low-dimensional structure.</p>
    <ul>
      <li><b>Geometry</b> supplies distances, neighborhoods, projections, and matrix shapes; those are the objects Truncated SVD / Latent Semantic Analysis actually manipulates.</li>
      <li><b>Optimization</b> supplies the repeated move: assign, weight, factor, or score, then improve the quantity written in the Mathematics section.</li>
      <li><b>Probability</b> supplies normalization whenever several explanations compete for the same point.</li>
    </ul>
    <p>Where it leads: this lesson supports later representation learning, retrieval, anomaly monitoring, and evaluation. The ideas here are reused by supervised feature engineering, deep embeddings in Part 6, and recommender systems in later applied lessons.</p>`,
  intuition: String.raw`
    <p>The concrete problem is simple to state and hard to do honestly: unlabeled data contains patterns, but no teacher tells us which pattern is real. Truncated SVD / Latent Semantic Analysis gives one disciplined way to make that hidden structure visible.</p>
    <p>The naive approach is to stare at a scatterplot or choose groups by hand. That fails as soon as the dimension rises, the clusters overlap, or the structure is not a round blob. The mental model is to replace visual judgment with a computable criterion: a distance, a weight, a graph, a factorization, a density, or a rule count.</p>
    <p>The design decision people gloss over is the choice of <b>what counts as close or explanatory</b>. Change that choice and the same data can produce different structure. A wise unsupervised workflow therefore treats the algorithm as a lens, not an oracle: it reveals the structure that its criterion is able to see.</p>`,
  mathematics: String.raw`
    <p>The core computation for Truncated SVD / Latent Semantic Analysis is:</p>
    <div class="formula-box">$$X_c=U\Sigma V^\top,\qquad Z=X_cV_r$$</div>
    <p>Here $X_c\in\mathbb{R}^{m\times n}$ is centered data, $V_r$ keeps $r$ directions, and $Z$ is the lower-dimensional representation.</p>
    <p><b>A tiny numeric pass.</b> The purpose of the arithmetic is not to be large; it is to make the mechanism visible enough that you can audit it by hand.</p>
    <ol class="work">
      <li>column means are $[(1+2+3+4)/4,(2+1+4+3)/4]=[2.50,2.50]$</li>
      <li>the singular values are $[2.828,1.414]$, so energies are $[8.000,2.000]$</li>
      <li>the first direction explains $8.000/(8.000+2.000)=0.800$ of the variance</li>
    </ol>
    <p>The number is a decision, not decoration: it decides which point joins which representative, which neighbor receives influence, which component owns a datum, which direction is kept, or which rule deserves attention. That is why unsupervised learning is so sensitive to scaling and preprocessing — the calculation only sees the quantities we give it.</p>
    <p><b>Shape bookkeeping.</b> In a toy matrix with $m=4$ examples and $n=2$ measured coordinates, a two-dimensional method starts with $X\in\mathbb{R}^{4\times2}$. A one-dimensional representation returns $Z\in\mathbb{R}^{4\times1}$; a two-cluster representation returns labels in $\{0,1\}^4$; a pairwise graph returns an affinity matrix in $\mathbb{R}^{4\times4}$. Keeping those shapes straight prevents most implementation bugs.</p>`,
  pitfalls: String.raw`
    <ul>
      <li><b>Unscaled features silently dominate.</b> Every distance, kernel, factorization, or score above is computed on the numeric scale you provide; a large-unit feature can become the whole lesson's mechanism by accident.</li>
      <li><b>Treating the output as ground truth.</b> The algorithm optimizes its own criterion, not a hidden label; if the criterion is misaligned, the structure can be clean and still irrelevant.</li>
      <li><b>Forgetting stability checks.</b> Rerun with nearby hyperparameters or resampled data; if the arithmetic flips under tiny changes, the discovered pattern is a fragile artifact.</li>
      <li><b>Evaluating with the training objective only.</b> A lower objective can mean a better fit to noise. Use external knowledge, held-out reconstruction, or the evaluation tools in (4.11) whenever possible.</li>
    </ul>`
};

/* ---------------- 4.14 Kernel PCA ---------------- */
window.ALLML_CONTENT["4.14"] = {
  tagline: "Kernel PCA turns unlabeled data into structure by choosing the right notion of similarity, compression, or surprise.",
  colab: "https://colab.research.google.com/github/niamleeson/ml-math/blob/main/notebooks/4.14-kernel-pca.ipynb",
  context: String.raw`
    <p>Part 4 moves from prediction with labels to discovery without labels. Probability normalization and distance-based kernels become the way local influence is measured.</p>
    <ul>
      <li><b>Geometry</b> supplies distances, neighborhoods, projections, and matrix shapes; those are the objects Kernel PCA actually manipulates.</li>
      <li><b>Optimization</b> supplies the repeated move: assign, weight, factor, or score, then improve the quantity written in the Mathematics section.</li>
      <li><b>Probability</b> supplies normalization whenever several explanations compete for the same point.</li>
    </ul>
    <p>Where it leads: this lesson supports later representation learning, retrieval, anomaly monitoring, and evaluation. The ideas here are reused by supervised feature engineering, deep embeddings in Part 6, and recommender systems in later applied lessons.</p>`,
  intuition: String.raw`
    <p>The concrete problem is simple to state and hard to do honestly: unlabeled data contains patterns, but no teacher tells us which pattern is real. Kernel PCA gives one disciplined way to make that hidden structure visible.</p>
    <p>The naive approach is to stare at a scatterplot or choose groups by hand. That fails as soon as the dimension rises, the clusters overlap, or the structure is not a round blob. The mental model is to replace visual judgment with a computable criterion: a distance, a weight, a graph, a factorization, a density, or a rule count.</p>
    <p>The design decision people gloss over is the choice of <b>what counts as close or explanatory</b>. Change that choice and the same data can produce different structure. A wise unsupervised workflow therefore treats the algorithm as a lens, not an oracle: it reveals the structure that its criterion is able to see.</p>`,
  mathematics: String.raw`
    <p>The core computation for Kernel PCA is:</p>
    <div class="formula-box">$$p_i=\frac{\exp(-d_i^2/2h^2)}{\sum_j\exp(-d_j^2/2h^2)}$$</div>
    <p>Here $d_i$ is a distance from the query, $h$ is the locality scale, and $p_i$ is the normalized influence weight.</p>
    <p><b>A tiny numeric pass.</b> The purpose of the arithmetic is not to be large; it is to make the mechanism visible enough that you can audit it by hand.</p>
    <ol class="work">
      <li>with $h=1$ and distances $[1,0,1]$, exponentials are $[e^{-0.5},e^0,e^{-0.5}]=[0.607,1.000,0.607]$</li>
      <li>sum the weights: $0.607+1.000+0.607=2.213$</li>
      <li>the middle point gets $1.000/2.213=0.452$ of the influence</li>
    </ol>
    <p>The number is a decision, not decoration: it decides which point joins which representative, which neighbor receives influence, which component owns a datum, which direction is kept, or which rule deserves attention. That is why unsupervised learning is so sensitive to scaling and preprocessing — the calculation only sees the quantities we give it.</p>
    <p><b>Shape bookkeeping.</b> In a toy matrix with $m=4$ examples and $n=2$ measured coordinates, a two-dimensional method starts with $X\in\mathbb{R}^{4\times2}$. A one-dimensional representation returns $Z\in\mathbb{R}^{4\times1}$; a two-cluster representation returns labels in $\{0,1\}^4$; a pairwise graph returns an affinity matrix in $\mathbb{R}^{4\times4}$. Keeping those shapes straight prevents most implementation bugs.</p>`,
  pitfalls: String.raw`
    <ul>
      <li><b>Unscaled features silently dominate.</b> Every distance, kernel, factorization, or score above is computed on the numeric scale you provide; a large-unit feature can become the whole lesson's mechanism by accident.</li>
      <li><b>Treating the output as ground truth.</b> The algorithm optimizes its own criterion, not a hidden label; if the criterion is misaligned, the structure can be clean and still irrelevant.</li>
      <li><b>Forgetting stability checks.</b> Rerun with nearby hyperparameters or resampled data; if the arithmetic flips under tiny changes, the discovered pattern is a fragile artifact.</li>
      <li><b>Evaluating with the training objective only.</b> A lower objective can mean a better fit to noise. Use external knowledge, held-out reconstruction, or the evaluation tools in (4.11) whenever possible.</li>
    </ul>`
};

/* ---------------- 4.15 Independent Component Analysis ---------------- */
window.ALLML_CONTENT["4.15"] = {
  tagline: "Independent Component Analysis turns unlabeled data into structure by choosing the right notion of similarity, compression, or surprise.",
  colab: "https://colab.research.google.com/github/niamleeson/ml-math/blob/main/notebooks/4.15-ica.ipynb",
  context: String.raw`
    <p>Part 4 moves from prediction with labels to discovery without labels. Vectors, covariance, and matrix factorization become the language for finding hidden low-dimensional structure.</p>
    <ul>
      <li><b>Geometry</b> supplies distances, neighborhoods, projections, and matrix shapes; those are the objects Independent Component Analysis actually manipulates.</li>
      <li><b>Optimization</b> supplies the repeated move: assign, weight, factor, or score, then improve the quantity written in the Mathematics section.</li>
      <li><b>Probability</b> supplies normalization whenever several explanations compete for the same point.</li>
    </ul>
    <p>Where it leads: this lesson supports later representation learning, retrieval, anomaly monitoring, and evaluation. The ideas here are reused by supervised feature engineering, deep embeddings in Part 6, and recommender systems in later applied lessons.</p>`,
  intuition: String.raw`
    <p>The concrete problem is simple to state and hard to do honestly: unlabeled data contains patterns, but no teacher tells us which pattern is real. Independent Component Analysis gives one disciplined way to make that hidden structure visible.</p>
    <p>The naive approach is to stare at a scatterplot or choose groups by hand. That fails as soon as the dimension rises, the clusters overlap, or the structure is not a round blob. The mental model is to replace visual judgment with a computable criterion: a distance, a weight, a graph, a factorization, a density, or a rule count.</p>
    <p>The design decision people gloss over is the choice of <b>what counts as close or explanatory</b>. Change that choice and the same data can produce different structure. A wise unsupervised workflow therefore treats the algorithm as a lens, not an oracle: it reveals the structure that its criterion is able to see.</p>`,
  mathematics: String.raw`
    <p>The core computation for Independent Component Analysis is:</p>
    <div class="formula-box">$$X_c=U\Sigma V^\top,\qquad Z=X_cV_r$$</div>
    <p>Here $X_c\in\mathbb{R}^{m\times n}$ is centered data, $V_r$ keeps $r$ directions, and $Z$ is the lower-dimensional representation.</p>
    <p><b>A tiny numeric pass.</b> The purpose of the arithmetic is not to be large; it is to make the mechanism visible enough that you can audit it by hand.</p>
    <ol class="work">
      <li>column means are $[(1+2+3+4)/4,(2+1+4+3)/4]=[2.50,2.50]$</li>
      <li>the singular values are $[2.828,1.414]$, so energies are $[8.000,2.000]$</li>
      <li>the first direction explains $8.000/(8.000+2.000)=0.800$ of the variance</li>
    </ol>
    <p>The number is a decision, not decoration: it decides which point joins which representative, which neighbor receives influence, which component owns a datum, which direction is kept, or which rule deserves attention. That is why unsupervised learning is so sensitive to scaling and preprocessing — the calculation only sees the quantities we give it.</p>
    <p><b>Shape bookkeeping.</b> In a toy matrix with $m=4$ examples and $n=2$ measured coordinates, a two-dimensional method starts with $X\in\mathbb{R}^{4\times2}$. A one-dimensional representation returns $Z\in\mathbb{R}^{4\times1}$; a two-cluster representation returns labels in $\{0,1\}^4$; a pairwise graph returns an affinity matrix in $\mathbb{R}^{4\times4}$. Keeping those shapes straight prevents most implementation bugs.</p>`,
  pitfalls: String.raw`
    <ul>
      <li><b>Unscaled features silently dominate.</b> Every distance, kernel, factorization, or score above is computed on the numeric scale you provide; a large-unit feature can become the whole lesson's mechanism by accident.</li>
      <li><b>Treating the output as ground truth.</b> The algorithm optimizes its own criterion, not a hidden label; if the criterion is misaligned, the structure can be clean and still irrelevant.</li>
      <li><b>Forgetting stability checks.</b> Rerun with nearby hyperparameters or resampled data; if the arithmetic flips under tiny changes, the discovered pattern is a fragile artifact.</li>
      <li><b>Evaluating with the training objective only.</b> A lower objective can mean a better fit to noise. Use external knowledge, held-out reconstruction, or the evaluation tools in (4.11) whenever possible.</li>
    </ul>`
};

/* ---------------- 4.16 Factor analysis ---------------- */
window.ALLML_CONTENT["4.16"] = {
  tagline: "Factor analysis turns unlabeled data into structure by choosing the right notion of similarity, compression, or surprise.",
  colab: "https://colab.research.google.com/github/niamleeson/ml-math/blob/main/notebooks/4.16-factor-analysis.ipynb",
  context: String.raw`
    <p>Part 4 moves from prediction with labels to discovery without labels. Vectors, covariance, and matrix factorization become the language for finding hidden low-dimensional structure.</p>
    <ul>
      <li><b>Geometry</b> supplies distances, neighborhoods, projections, and matrix shapes; those are the objects Factor analysis actually manipulates.</li>
      <li><b>Optimization</b> supplies the repeated move: assign, weight, factor, or score, then improve the quantity written in the Mathematics section.</li>
      <li><b>Probability</b> supplies normalization whenever several explanations compete for the same point.</li>
    </ul>
    <p>Where it leads: this lesson supports later representation learning, retrieval, anomaly monitoring, and evaluation. The ideas here are reused by supervised feature engineering, deep embeddings in Part 6, and recommender systems in later applied lessons.</p>`,
  intuition: String.raw`
    <p>The concrete problem is simple to state and hard to do honestly: unlabeled data contains patterns, but no teacher tells us which pattern is real. Factor analysis gives one disciplined way to make that hidden structure visible.</p>
    <p>The naive approach is to stare at a scatterplot or choose groups by hand. That fails as soon as the dimension rises, the clusters overlap, or the structure is not a round blob. The mental model is to replace visual judgment with a computable criterion: a distance, a weight, a graph, a factorization, a density, or a rule count.</p>
    <p>The design decision people gloss over is the choice of <b>what counts as close or explanatory</b>. Change that choice and the same data can produce different structure. A wise unsupervised workflow therefore treats the algorithm as a lens, not an oracle: it reveals the structure that its criterion is able to see.</p>`,
  mathematics: String.raw`
    <p>The core computation for Factor analysis is:</p>
    <div class="formula-box">$$X_c=U\Sigma V^\top,\qquad Z=X_cV_r$$</div>
    <p>Here $X_c\in\mathbb{R}^{m\times n}$ is centered data, $V_r$ keeps $r$ directions, and $Z$ is the lower-dimensional representation.</p>
    <p><b>A tiny numeric pass.</b> The purpose of the arithmetic is not to be large; it is to make the mechanism visible enough that you can audit it by hand.</p>
    <ol class="work">
      <li>column means are $[(1+2+3+4)/4,(2+1+4+3)/4]=[2.50,2.50]$</li>
      <li>the singular values are $[2.828,1.414]$, so energies are $[8.000,2.000]$</li>
      <li>the first direction explains $8.000/(8.000+2.000)=0.800$ of the variance</li>
    </ol>
    <p>The number is a decision, not decoration: it decides which point joins which representative, which neighbor receives influence, which component owns a datum, which direction is kept, or which rule deserves attention. That is why unsupervised learning is so sensitive to scaling and preprocessing — the calculation only sees the quantities we give it.</p>
    <p><b>Shape bookkeeping.</b> In a toy matrix with $m=4$ examples and $n=2$ measured coordinates, a two-dimensional method starts with $X\in\mathbb{R}^{4\times2}$. A one-dimensional representation returns $Z\in\mathbb{R}^{4\times1}$; a two-cluster representation returns labels in $\{0,1\}^4$; a pairwise graph returns an affinity matrix in $\mathbb{R}^{4\times4}$. Keeping those shapes straight prevents most implementation bugs.</p>`,
  pitfalls: String.raw`
    <ul>
      <li><b>Unscaled features silently dominate.</b> Every distance, kernel, factorization, or score above is computed on the numeric scale you provide; a large-unit feature can become the whole lesson's mechanism by accident.</li>
      <li><b>Treating the output as ground truth.</b> The algorithm optimizes its own criterion, not a hidden label; if the criterion is misaligned, the structure can be clean and still irrelevant.</li>
      <li><b>Forgetting stability checks.</b> Rerun with nearby hyperparameters or resampled data; if the arithmetic flips under tiny changes, the discovered pattern is a fragile artifact.</li>
      <li><b>Evaluating with the training objective only.</b> A lower objective can mean a better fit to noise. Use external knowledge, held-out reconstruction, or the evaluation tools in (4.11) whenever possible.</li>
    </ul>`
};

/* ---------------- 4.17 Dictionary learning & sparse coding ---------------- */
window.ALLML_CONTENT["4.17"] = {
  tagline: "Dictionary learning & sparse coding turns unlabeled data into structure by choosing the right notion of similarity, compression, or surprise.",
  colab: "https://colab.research.google.com/github/niamleeson/ml-math/blob/main/notebooks/4.17-dictionary-learning-sparse-coding.ipynb",
  context: String.raw`
    <p>Part 4 moves from prediction with labels to discovery without labels. Linear combinations become more interpretable when an $\ell_1$ penalty forces most coefficients to zero.</p>
    <ul>
      <li><b>Geometry</b> supplies distances, neighborhoods, projections, and matrix shapes; those are the objects Dictionary learning & sparse coding actually manipulates.</li>
      <li><b>Optimization</b> supplies the repeated move: assign, weight, factor, or score, then improve the quantity written in the Mathematics section.</li>
      <li><b>Probability</b> supplies normalization whenever several explanations compete for the same point.</li>
    </ul>
    <p>Where it leads: this lesson supports later representation learning, retrieval, anomaly monitoring, and evaluation. The ideas here are reused by supervised feature engineering, deep embeddings in Part 6, and recommender systems in later applied lessons.</p>`,
  intuition: String.raw`
    <p>The concrete problem is simple to state and hard to do honestly: unlabeled data contains patterns, but no teacher tells us which pattern is real. Dictionary learning & sparse coding gives one disciplined way to make that hidden structure visible.</p>
    <p>The naive approach is to stare at a scatterplot or choose groups by hand. That fails as soon as the dimension rises, the clusters overlap, or the structure is not a round blob. The mental model is to replace visual judgment with a computable criterion: a distance, a weight, a graph, a factorization, a density, or a rule count.</p>
    <p>The design decision people gloss over is the choice of <b>what counts as close or explanatory</b>. Change that choice and the same data can produce different structure. A wise unsupervised workflow therefore treats the algorithm as a lens, not an oracle: it reveals the structure that its criterion is able to see.</p>`,
  mathematics: String.raw`
    <p>The core computation for Dictionary learning & sparse coding is:</p>
    <div class="formula-box">$$X_c=U\Sigma V^\top,\qquad Z=X_cV_r$$</div>
    <p>Here $X_c\in\mathbb{R}^{m\times n}$ is centered data, $V_r$ keeps $r$ directions, and $Z$ is the lower-dimensional representation.</p>
    <p><b>A tiny numeric pass.</b> The purpose of the arithmetic is not to be large; it is to make the mechanism visible enough that you can audit it by hand.</p>
    <ol class="work">
      <li>column means are $[(1+2+3+4)/4,(2+1+4+3)/4]=[2.50,2.50]$</li>
      <li>the singular values are $[2.828,1.414]$, so energies are $[8.000,2.000]$</li>
      <li>the first direction explains $8.000/(8.000+2.000)=0.800$ of the variance</li>
    </ol>
    <p>The number is a decision, not decoration: it decides which point joins which representative, which neighbor receives influence, which component owns a datum, which direction is kept, or which rule deserves attention. That is why unsupervised learning is so sensitive to scaling and preprocessing — the calculation only sees the quantities we give it.</p>
    <p><b>Shape bookkeeping.</b> In a toy matrix with $m=4$ examples and $n=2$ measured coordinates, a two-dimensional method starts with $X\in\mathbb{R}^{4\times2}$. A one-dimensional representation returns $Z\in\mathbb{R}^{4\times1}$; a two-cluster representation returns labels in $\{0,1\}^4$; a pairwise graph returns an affinity matrix in $\mathbb{R}^{4\times4}$. Keeping those shapes straight prevents most implementation bugs.</p>`,
  pitfalls: String.raw`
    <ul>
      <li><b>Unscaled features silently dominate.</b> Every distance, kernel, factorization, or score above is computed on the numeric scale you provide; a large-unit feature can become the whole lesson's mechanism by accident.</li>
      <li><b>Treating the output as ground truth.</b> The algorithm optimizes its own criterion, not a hidden label; if the criterion is misaligned, the structure can be clean and still irrelevant.</li>
      <li><b>Forgetting stability checks.</b> Rerun with nearby hyperparameters or resampled data; if the arithmetic flips under tiny changes, the discovered pattern is a fragile artifact.</li>
      <li><b>Evaluating with the training objective only.</b> A lower objective can mean a better fit to noise. Use external knowledge, held-out reconstruction, or the evaluation tools in (4.11) whenever possible.</li>
    </ul>`
};

/* ---------------- 4.18 Random projections ---------------- */
window.ALLML_CONTENT["4.18"] = {
  tagline: "Random projections turns unlabeled data into structure by choosing the right notion of similarity, compression, or surprise.",
  colab: "https://colab.research.google.com/github/niamleeson/ml-math/blob/main/notebooks/4.18-random-projections.ipynb",
  context: String.raw`
    <p>Part 4 moves from prediction with labels to discovery without labels. Vectors, covariance, and matrix factorization become the language for finding hidden low-dimensional structure.</p>
    <ul>
      <li><b>Geometry</b> supplies distances, neighborhoods, projections, and matrix shapes; those are the objects Random projections actually manipulates.</li>
      <li><b>Optimization</b> supplies the repeated move: assign, weight, factor, or score, then improve the quantity written in the Mathematics section.</li>
      <li><b>Probability</b> supplies normalization whenever several explanations compete for the same point.</li>
    </ul>
    <p>Where it leads: this lesson supports later representation learning, retrieval, anomaly monitoring, and evaluation. The ideas here are reused by supervised feature engineering, deep embeddings in Part 6, and recommender systems in later applied lessons.</p>`,
  intuition: String.raw`
    <p>The concrete problem is simple to state and hard to do honestly: unlabeled data contains patterns, but no teacher tells us which pattern is real. Random projections gives one disciplined way to make that hidden structure visible.</p>
    <p>The naive approach is to stare at a scatterplot or choose groups by hand. That fails as soon as the dimension rises, the clusters overlap, or the structure is not a round blob. The mental model is to replace visual judgment with a computable criterion: a distance, a weight, a graph, a factorization, a density, or a rule count.</p>
    <p>The design decision people gloss over is the choice of <b>what counts as close or explanatory</b>. Change that choice and the same data can produce different structure. A wise unsupervised workflow therefore treats the algorithm as a lens, not an oracle: it reveals the structure that its criterion is able to see.</p>`,
  mathematics: String.raw`
    <p>The core computation for Random projections is:</p>
    <div class="formula-box">$$X_c=U\Sigma V^\top,\qquad Z=X_cV_r$$</div>
    <p>Here $X_c\in\mathbb{R}^{m\times n}$ is centered data, $V_r$ keeps $r$ directions, and $Z$ is the lower-dimensional representation.</p>
    <p><b>A tiny numeric pass.</b> The purpose of the arithmetic is not to be large; it is to make the mechanism visible enough that you can audit it by hand.</p>
    <ol class="work">
      <li>column means are $[(1+2+3+4)/4,(2+1+4+3)/4]=[2.50,2.50]$</li>
      <li>the singular values are $[2.828,1.414]$, so energies are $[8.000,2.000]$</li>
      <li>the first direction explains $8.000/(8.000+2.000)=0.800$ of the variance</li>
    </ol>
    <p>The number is a decision, not decoration: it decides which point joins which representative, which neighbor receives influence, which component owns a datum, which direction is kept, or which rule deserves attention. That is why unsupervised learning is so sensitive to scaling and preprocessing — the calculation only sees the quantities we give it.</p>
    <p><b>Shape bookkeeping.</b> In a toy matrix with $m=4$ examples and $n=2$ measured coordinates, a two-dimensional method starts with $X\in\mathbb{R}^{4\times2}$. A one-dimensional representation returns $Z\in\mathbb{R}^{4\times1}$; a two-cluster representation returns labels in $\{0,1\}^4$; a pairwise graph returns an affinity matrix in $\mathbb{R}^{4\times4}$. Keeping those shapes straight prevents most implementation bugs.</p>`,
  pitfalls: String.raw`
    <ul>
      <li><b>Unscaled features silently dominate.</b> Every distance, kernel, factorization, or score above is computed on the numeric scale you provide; a large-unit feature can become the whole lesson's mechanism by accident.</li>
      <li><b>Treating the output as ground truth.</b> The algorithm optimizes its own criterion, not a hidden label; if the criterion is misaligned, the structure can be clean and still irrelevant.</li>
      <li><b>Forgetting stability checks.</b> Rerun with nearby hyperparameters or resampled data; if the arithmetic flips under tiny changes, the discovered pattern is a fragile artifact.</li>
      <li><b>Evaluating with the training objective only.</b> A lower objective can mean a better fit to noise. Use external knowledge, held-out reconstruction, or the evaluation tools in (4.11) whenever possible.</li>
    </ul>`
};

/* ---------------- 4.19 t-SNE ---------------- */
window.ALLML_CONTENT["4.19"] = {
  tagline: "t-SNE turns unlabeled data into structure by choosing the right notion of similarity, compression, or surprise.",
  colab: "https://colab.research.google.com/github/niamleeson/ml-math/blob/main/notebooks/4.19-t-sne.ipynb",
  context: String.raw`
    <p>Part 4 moves from prediction with labels to discovery without labels. Probability normalization and distance-based kernels become the way local influence is measured.</p>
    <ul>
      <li><b>Geometry</b> supplies distances, neighborhoods, projections, and matrix shapes; those are the objects t-SNE actually manipulates.</li>
      <li><b>Optimization</b> supplies the repeated move: assign, weight, factor, or score, then improve the quantity written in the Mathematics section.</li>
      <li><b>Probability</b> supplies normalization whenever several explanations compete for the same point.</li>
    </ul>
    <p>Where it leads: this lesson supports later representation learning, retrieval, anomaly monitoring, and evaluation. The ideas here are reused by supervised feature engineering, deep embeddings in Part 6, and recommender systems in later applied lessons.</p>`,
  intuition: String.raw`
    <p>The concrete problem is simple to state and hard to do honestly: unlabeled data contains patterns, but no teacher tells us which pattern is real. t-SNE gives one disciplined way to make that hidden structure visible.</p>
    <p>The naive approach is to stare at a scatterplot or choose groups by hand. That fails as soon as the dimension rises, the clusters overlap, or the structure is not a round blob. The mental model is to replace visual judgment with a computable criterion: a distance, a weight, a graph, a factorization, a density, or a rule count.</p>
    <p>The design decision people gloss over is the choice of <b>what counts as close or explanatory</b>. Change that choice and the same data can produce different structure. A wise unsupervised workflow therefore treats the algorithm as a lens, not an oracle: it reveals the structure that its criterion is able to see.</p>`,
  mathematics: String.raw`
    <p>The core computation for t-SNE is:</p>
    <div class="formula-box">$$p_i=\frac{\exp(-d_i^2/2h^2)}{\sum_j\exp(-d_j^2/2h^2)}$$</div>
    <p>Here $d_i$ is a distance from the query, $h$ is the locality scale, and $p_i$ is the normalized influence weight.</p>
    <p><b>A tiny numeric pass.</b> The purpose of the arithmetic is not to be large; it is to make the mechanism visible enough that you can audit it by hand.</p>
    <ol class="work">
      <li>with $h=1$ and distances $[1,0,1]$, exponentials are $[e^{-0.5},e^0,e^{-0.5}]=[0.607,1.000,0.607]$</li>
      <li>sum the weights: $0.607+1.000+0.607=2.213$</li>
      <li>the middle point gets $1.000/2.213=0.452$ of the influence</li>
    </ol>
    <p>The number is a decision, not decoration: it decides which point joins which representative, which neighbor receives influence, which component owns a datum, which direction is kept, or which rule deserves attention. That is why unsupervised learning is so sensitive to scaling and preprocessing — the calculation only sees the quantities we give it.</p>
    <p><b>Shape bookkeeping.</b> In a toy matrix with $m=4$ examples and $n=2$ measured coordinates, a two-dimensional method starts with $X\in\mathbb{R}^{4\times2}$. A one-dimensional representation returns $Z\in\mathbb{R}^{4\times1}$; a two-cluster representation returns labels in $\{0,1\}^4$; a pairwise graph returns an affinity matrix in $\mathbb{R}^{4\times4}$. Keeping those shapes straight prevents most implementation bugs.</p>`,
  pitfalls: String.raw`
    <ul>
      <li><b>Unscaled features silently dominate.</b> Every distance, kernel, factorization, or score above is computed on the numeric scale you provide; a large-unit feature can become the whole lesson's mechanism by accident.</li>
      <li><b>Treating the output as ground truth.</b> The algorithm optimizes its own criterion, not a hidden label; if the criterion is misaligned, the structure can be clean and still irrelevant.</li>
      <li><b>Forgetting stability checks.</b> Rerun with nearby hyperparameters or resampled data; if the arithmetic flips under tiny changes, the discovered pattern is a fragile artifact.</li>
      <li><b>Evaluating with the training objective only.</b> A lower objective can mean a better fit to noise. Use external knowledge, held-out reconstruction, or the evaluation tools in (4.11) whenever possible.</li>
    </ul>`
};

/* ---------------- 4.20 UMAP ---------------- */
window.ALLML_CONTENT["4.20"] = {
  tagline: "UMAP turns unlabeled data into structure by choosing the right notion of similarity, compression, or surprise.",
  colab: "https://colab.research.google.com/github/niamleeson/ml-math/blob/main/notebooks/4.20-umap.ipynb",
  context: String.raw`
    <p>Part 4 moves from prediction with labels to discovery without labels. Linear algebra meets graph structure: affinities become a Laplacian whose eigenvectors reveal geometry.</p>
    <ul>
      <li><b>Geometry</b> supplies distances, neighborhoods, projections, and matrix shapes; those are the objects UMAP actually manipulates.</li>
      <li><b>Optimization</b> supplies the repeated move: assign, weight, factor, or score, then improve the quantity written in the Mathematics section.</li>
      <li><b>Probability</b> supplies normalization whenever several explanations compete for the same point.</li>
    </ul>
    <p>Where it leads: this lesson supports later representation learning, retrieval, anomaly monitoring, and evaluation. The ideas here are reused by supervised feature engineering, deep embeddings in Part 6, and recommender systems in later applied lessons.</p>`,
  intuition: String.raw`
    <p>The concrete problem is simple to state and hard to do honestly: unlabeled data contains patterns, but no teacher tells us which pattern is real. UMAP gives one disciplined way to make that hidden structure visible.</p>
    <p>The naive approach is to stare at a scatterplot or choose groups by hand. That fails as soon as the dimension rises, the clusters overlap, or the structure is not a round blob. The mental model is to replace visual judgment with a computable criterion: a distance, a weight, a graph, a factorization, a density, or a rule count.</p>
    <p>The design decision people gloss over is the choice of <b>what counts as close or explanatory</b>. Change that choice and the same data can produce different structure. A wise unsupervised workflow therefore treats the algorithm as a lens, not an oracle: it reveals the structure that its criterion is able to see.</p>`,
  mathematics: String.raw`
    <p>The core computation for UMAP is:</p>
    <div class="formula-box">$$L=D-A,\qquad Lv=\lambda v$$</div>
    <p>Here $A$ is the affinity graph, $D$ is the diagonal degree matrix, $L$ is the Laplacian, and eigenvectors $v$ become coordinates.</p>
    <p><b>A tiny numeric pass.</b> The purpose of the arithmetic is not to be large; it is to make the mechanism visible enough that you can audit it by hand.</p>
    <ol class="work">
      <li>degrees are $[1,1,1,1]$, so $D=\operatorname{diag}(1,1,1,1)$</li>
      <li>the Laplacian eigenvalues are $[0.0,0.0,2.0,2.0]$</li>
      <li>there are $2$ zero eigenvalues, matching the two disconnected graph components</li>
    </ol>
    <p>The number is a decision, not decoration: it decides which point joins which representative, which neighbor receives influence, which component owns a datum, which direction is kept, or which rule deserves attention. That is why unsupervised learning is so sensitive to scaling and preprocessing — the calculation only sees the quantities we give it.</p>
    <p><b>Shape bookkeeping.</b> In a toy matrix with $m=4$ examples and $n=2$ measured coordinates, a two-dimensional method starts with $X\in\mathbb{R}^{4\times2}$. A one-dimensional representation returns $Z\in\mathbb{R}^{4\times1}$; a two-cluster representation returns labels in $\{0,1\}^4$; a pairwise graph returns an affinity matrix in $\mathbb{R}^{4\times4}$. Keeping those shapes straight prevents most implementation bugs.</p>`,
  pitfalls: String.raw`
    <ul>
      <li><b>Unscaled features silently dominate.</b> Every distance, kernel, factorization, or score above is computed on the numeric scale you provide; a large-unit feature can become the whole lesson's mechanism by accident.</li>
      <li><b>Treating the output as ground truth.</b> The algorithm optimizes its own criterion, not a hidden label; if the criterion is misaligned, the structure can be clean and still irrelevant.</li>
      <li><b>Forgetting stability checks.</b> Rerun with nearby hyperparameters or resampled data; if the arithmetic flips under tiny changes, the discovered pattern is a fragile artifact.</li>
      <li><b>Evaluating with the training objective only.</b> A lower objective can mean a better fit to noise. Use external knowledge, held-out reconstruction, or the evaluation tools in (4.11) whenever possible.</li>
    </ul>`
};

/* ---------------- 4.21 Manifold learning (Isomap, LLE, MDS, Laplacian eigenmaps) ---------------- */
window.ALLML_CONTENT["4.21"] = {
  tagline: "Manifold learning (Isomap, LLE, MDS, Laplacian eigenmaps) turns unlabeled data into structure by choosing the right notion of similarity, compression, or surprise.",
  colab: "https://colab.research.google.com/github/niamleeson/ml-math/blob/main/notebooks/4.21-manifold-learning.ipynb",
  context: String.raw`
    <p>Part 4 moves from prediction with labels to discovery without labels. Linear algebra meets graph structure: affinities become a Laplacian whose eigenvectors reveal geometry.</p>
    <ul>
      <li><b>Geometry</b> supplies distances, neighborhoods, projections, and matrix shapes; those are the objects Manifold learning (Isomap, LLE, MDS, Laplacian eigenmaps) actually manipulates.</li>
      <li><b>Optimization</b> supplies the repeated move: assign, weight, factor, or score, then improve the quantity written in the Mathematics section.</li>
      <li><b>Probability</b> supplies normalization whenever several explanations compete for the same point.</li>
    </ul>
    <p>Where it leads: this lesson supports later representation learning, retrieval, anomaly monitoring, and evaluation. The ideas here are reused by supervised feature engineering, deep embeddings in Part 6, and recommender systems in later applied lessons.</p>`,
  intuition: String.raw`
    <p>The concrete problem is simple to state and hard to do honestly: unlabeled data contains patterns, but no teacher tells us which pattern is real. Manifold learning (Isomap, LLE, MDS, Laplacian eigenmaps) gives one disciplined way to make that hidden structure visible.</p>
    <p>The naive approach is to stare at a scatterplot or choose groups by hand. That fails as soon as the dimension rises, the clusters overlap, or the structure is not a round blob. The mental model is to replace visual judgment with a computable criterion: a distance, a weight, a graph, a factorization, a density, or a rule count.</p>
    <p>The design decision people gloss over is the choice of <b>what counts as close or explanatory</b>. Change that choice and the same data can produce different structure. A wise unsupervised workflow therefore treats the algorithm as a lens, not an oracle: it reveals the structure that its criterion is able to see.</p>`,
  mathematics: String.raw`
    <p>The core computation for Manifold learning (Isomap, LLE, MDS, Laplacian eigenmaps) is:</p>
    <div class="formula-box">$$L=D-A,\qquad Lv=\lambda v$$</div>
    <p>Here $A$ is the affinity graph, $D$ is the diagonal degree matrix, $L$ is the Laplacian, and eigenvectors $v$ become coordinates.</p>
    <p><b>A tiny numeric pass.</b> The purpose of the arithmetic is not to be large; it is to make the mechanism visible enough that you can audit it by hand.</p>
    <ol class="work">
      <li>degrees are $[1,1,1,1]$, so $D=\operatorname{diag}(1,1,1,1)$</li>
      <li>the Laplacian eigenvalues are $[0.0,0.0,2.0,2.0]$</li>
      <li>there are $2$ zero eigenvalues, matching the two disconnected graph components</li>
    </ol>
    <p>The number is a decision, not decoration: it decides which point joins which representative, which neighbor receives influence, which component owns a datum, which direction is kept, or which rule deserves attention. That is why unsupervised learning is so sensitive to scaling and preprocessing — the calculation only sees the quantities we give it.</p>
    <p><b>Shape bookkeeping.</b> In a toy matrix with $m=4$ examples and $n=2$ measured coordinates, a two-dimensional method starts with $X\in\mathbb{R}^{4\times2}$. A one-dimensional representation returns $Z\in\mathbb{R}^{4\times1}$; a two-cluster representation returns labels in $\{0,1\}^4$; a pairwise graph returns an affinity matrix in $\mathbb{R}^{4\times4}$. Keeping those shapes straight prevents most implementation bugs.</p>`,
  pitfalls: String.raw`
    <ul>
      <li><b>Unscaled features silently dominate.</b> Every distance, kernel, factorization, or score above is computed on the numeric scale you provide; a large-unit feature can become the whole lesson's mechanism by accident.</li>
      <li><b>Treating the output as ground truth.</b> The algorithm optimizes its own criterion, not a hidden label; if the criterion is misaligned, the structure can be clean and still irrelevant.</li>
      <li><b>Forgetting stability checks.</b> Rerun with nearby hyperparameters or resampled data; if the arithmetic flips under tiny changes, the discovered pattern is a fragile artifact.</li>
      <li><b>Evaluating with the training objective only.</b> A lower objective can mean a better fit to noise. Use external knowledge, held-out reconstruction, or the evaluation tools in (4.11) whenever possible.</li>
    </ul>`
};

/* ---------------- 4.22 Non-negative Matrix Factorization ---------------- */
window.ALLML_CONTENT["4.22"] = {
  tagline: "Non-negative Matrix Factorization turns unlabeled data into structure by choosing the right notion of similarity, compression, or surprise.",
  colab: "https://colab.research.google.com/github/niamleeson/ml-math/blob/main/notebooks/4.22-nmf.ipynb",
  context: String.raw`
    <p>Part 4 moves from prediction with labels to discovery without labels. Matrix factorization becomes parts-based when every factor is constrained to be non-negative.</p>
    <ul>
      <li><b>Geometry</b> supplies distances, neighborhoods, projections, and matrix shapes; those are the objects Non-negative Matrix Factorization actually manipulates.</li>
      <li><b>Optimization</b> supplies the repeated move: assign, weight, factor, or score, then improve the quantity written in the Mathematics section.</li>
      <li><b>Probability</b> supplies normalization whenever several explanations compete for the same point.</li>
    </ul>
    <p>Where it leads: this lesson supports later representation learning, retrieval, anomaly monitoring, and evaluation. The ideas here are reused by supervised feature engineering, deep embeddings in Part 6, and recommender systems in later applied lessons.</p>`,
  intuition: String.raw`
    <p>The concrete problem is simple to state and hard to do honestly: unlabeled data contains patterns, but no teacher tells us which pattern is real. Non-negative Matrix Factorization gives one disciplined way to make that hidden structure visible.</p>
    <p>The naive approach is to stare at a scatterplot or choose groups by hand. That fails as soon as the dimension rises, the clusters overlap, or the structure is not a round blob. The mental model is to replace visual judgment with a computable criterion: a distance, a weight, a graph, a factorization, a density, or a rule count.</p>
    <p>The design decision people gloss over is the choice of <b>what counts as close or explanatory</b>. Change that choice and the same data can produce different structure. A wise unsupervised workflow therefore treats the algorithm as a lens, not an oracle: it reveals the structure that its criterion is able to see.</p>`,
  mathematics: String.raw`
    <p>The core computation for Non-negative Matrix Factorization is:</p>
    <div class="formula-box">$$X_c=U\Sigma V^\top,\qquad Z=X_cV_r$$</div>
    <p>Here $X_c\in\mathbb{R}^{m\times n}$ is centered data, $V_r$ keeps $r$ directions, and $Z$ is the lower-dimensional representation.</p>
    <p><b>A tiny numeric pass.</b> The purpose of the arithmetic is not to be large; it is to make the mechanism visible enough that you can audit it by hand.</p>
    <ol class="work">
      <li>column means are $[(1+2+3+4)/4,(2+1+4+3)/4]=[2.50,2.50]$</li>
      <li>the singular values are $[2.828,1.414]$, so energies are $[8.000,2.000]$</li>
      <li>the first direction explains $8.000/(8.000+2.000)=0.800$ of the variance</li>
    </ol>
    <p>The number is a decision, not decoration: it decides which point joins which representative, which neighbor receives influence, which component owns a datum, which direction is kept, or which rule deserves attention. That is why unsupervised learning is so sensitive to scaling and preprocessing — the calculation only sees the quantities we give it.</p>
    <p><b>Shape bookkeeping.</b> In a toy matrix with $m=4$ examples and $n=2$ measured coordinates, a two-dimensional method starts with $X\in\mathbb{R}^{4\times2}$. A one-dimensional representation returns $Z\in\mathbb{R}^{4\times1}$; a two-cluster representation returns labels in $\{0,1\}^4$; a pairwise graph returns an affinity matrix in $\mathbb{R}^{4\times4}$. Keeping those shapes straight prevents most implementation bugs.</p>`,
  pitfalls: String.raw`
    <ul>
      <li><b>Unscaled features silently dominate.</b> Every distance, kernel, factorization, or score above is computed on the numeric scale you provide; a large-unit feature can become the whole lesson's mechanism by accident.</li>
      <li><b>Treating the output as ground truth.</b> The algorithm optimizes its own criterion, not a hidden label; if the criterion is misaligned, the structure can be clean and still irrelevant.</li>
      <li><b>Forgetting stability checks.</b> Rerun with nearby hyperparameters or resampled data; if the arithmetic flips under tiny changes, the discovered pattern is a fragile artifact.</li>
      <li><b>Evaluating with the training objective only.</b> A lower objective can mean a better fit to noise. Use external knowledge, held-out reconstruction, or the evaluation tools in (4.11) whenever possible.</li>
    </ul>`
};

/* ---------------- 4.23 Biclustering / co-clustering ---------------- */
window.ALLML_CONTENT["4.23"] = {
  tagline: "Biclustering / co-clustering turns unlabeled data into structure by choosing the right notion of similarity, compression, or surprise.",
  colab: "https://colab.research.google.com/github/niamleeson/ml-math/blob/main/notebooks/4.23-biclustering.ipynb",
  context: String.raw`
    <p>Part 4 moves from prediction with labels to discovery without labels. Matrix indexing becomes the model: rows and columns are chosen together, not one at a time.</p>
    <ul>
      <li><b>Geometry</b> supplies distances, neighborhoods, projections, and matrix shapes; those are the objects Biclustering / co-clustering actually manipulates.</li>
      <li><b>Optimization</b> supplies the repeated move: assign, weight, factor, or score, then improve the quantity written in the Mathematics section.</li>
      <li><b>Probability</b> supplies normalization whenever several explanations compete for the same point.</li>
    </ul>
    <p>Where it leads: this lesson supports later representation learning, retrieval, anomaly monitoring, and evaluation. The ideas here are reused by supervised feature engineering, deep embeddings in Part 6, and recommender systems in later applied lessons.</p>`,
  intuition: String.raw`
    <p>The concrete problem is simple to state and hard to do honestly: unlabeled data contains patterns, but no teacher tells us which pattern is real. Biclustering / co-clustering gives one disciplined way to make that hidden structure visible.</p>
    <p>The naive approach is to stare at a scatterplot or choose groups by hand. That fails as soon as the dimension rises, the clusters overlap, or the structure is not a round blob. The mental model is to replace visual judgment with a computable criterion: a distance, a weight, a graph, a factorization, a density, or a rule count.</p>
    <p>The design decision people gloss over is the choice of <b>what counts as close or explanatory</b>. Change that choice and the same data can produce different structure. A wise unsupervised workflow therefore treats the algorithm as a lens, not an oracle: it reveals the structure that its criterion is able to see.</p>`,
  mathematics: String.raw`
    <p>The core computation for Biclustering / co-clustering is:</p>
    <div class="formula-box">$$H(I,J)=\frac{1}{|I||J|}\sum_{i\in I,j\in J}(x_{ij}-\hat x_{ij})^2$$</div>
    <p>Here $I$ is a row set, $J$ is a column set, and the residue $H$ measures block coherence.</p>
    <p><b>A tiny numeric pass.</b> The purpose of the arithmetic is not to be large; it is to make the mechanism visible enough that you can audit it by hand.</p>
    <ol class="work">
      <li>block mean is $(5+5+5+4)/4=4.750$</li>
      <li>additive row-plus-column prediction leaves residuals whose squared mean is $0.0625$</li>
      <li>small residue means the selected rows and columns move together</li>
    </ol>
    <p>The number is a decision, not decoration: it decides which point joins which representative, which neighbor receives influence, which component owns a datum, which direction is kept, or which rule deserves attention. That is why unsupervised learning is so sensitive to scaling and preprocessing — the calculation only sees the quantities we give it.</p>
    <p><b>Shape bookkeeping.</b> In a toy matrix with $m=4$ examples and $n=2$ measured coordinates, a two-dimensional method starts with $X\in\mathbb{R}^{4\times2}$. A one-dimensional representation returns $Z\in\mathbb{R}^{4\times1}$; a two-cluster representation returns labels in $\{0,1\}^4$; a pairwise graph returns an affinity matrix in $\mathbb{R}^{4\times4}$. Keeping those shapes straight prevents most implementation bugs.</p>`,
  pitfalls: String.raw`
    <ul>
      <li><b>Unscaled features silently dominate.</b> Every distance, kernel, factorization, or score above is computed on the numeric scale you provide; a large-unit feature can become the whole lesson's mechanism by accident.</li>
      <li><b>Treating the output as ground truth.</b> The algorithm optimizes its own criterion, not a hidden label; if the criterion is misaligned, the structure can be clean and still irrelevant.</li>
      <li><b>Forgetting stability checks.</b> Rerun with nearby hyperparameters or resampled data; if the arithmetic flips under tiny changes, the discovered pattern is a fragile artifact.</li>
      <li><b>Evaluating with the training objective only.</b> A lower objective can mean a better fit to noise. Use external knowledge, held-out reconstruction, or the evaluation tools in (4.11) whenever possible.</li>
    </ul>`
};

/* ---------------- 4.24 Anomaly & outlier detection (Isolation Forest, One-Class SVM, LOF) ---------------- */
window.ALLML_CONTENT["4.24"] = {
  tagline: "Anomaly & outlier detection (Isolation Forest, One-Class SVM, LOF) turns unlabeled data into structure by choosing the right notion of similarity, compression, or surprise.",
  colab: "https://colab.research.google.com/github/niamleeson/ml-math/blob/main/notebooks/4.24-anomaly-outlier-detection.ipynb",
  context: String.raw`
    <p>Part 4 moves from prediction with labels to discovery without labels. Density, distance, and margin ideas become scores for identifying points that do not behave like the rest.</p>
    <ul>
      <li><b>Geometry</b> supplies distances, neighborhoods, projections, and matrix shapes; those are the objects Anomaly & outlier detection (Isolation Forest, One-Class SVM, LOF) actually manipulates.</li>
      <li><b>Optimization</b> supplies the repeated move: assign, weight, factor, or score, then improve the quantity written in the Mathematics section.</li>
      <li><b>Probability</b> supplies normalization whenever several explanations compete for the same point.</li>
    </ul>
    <p>Where it leads: this lesson supports later representation learning, retrieval, anomaly monitoring, and evaluation. The ideas here are reused by supervised feature engineering, deep embeddings in Part 6, and recommender systems in later applied lessons.</p>`,
  intuition: String.raw`
    <p>The concrete problem is simple to state and hard to do honestly: unlabeled data contains patterns, but no teacher tells us which pattern is real. Anomaly & outlier detection (Isolation Forest, One-Class SVM, LOF) gives one disciplined way to make that hidden structure visible.</p>
    <p>The naive approach is to stare at a scatterplot or choose groups by hand. That fails as soon as the dimension rises, the clusters overlap, or the structure is not a round blob. The mental model is to replace visual judgment with a computable criterion: a distance, a weight, a graph, a factorization, a density, or a rule count.</p>
    <p>The design decision people gloss over is the choice of <b>what counts as close or explanatory</b>. Change that choice and the same data can produce different structure. A wise unsupervised workflow therefore treats the algorithm as a lens, not an oracle: it reveals the structure that its criterion is able to see.</p>`,
  mathematics: String.raw`
    <p>The core computation for Anomaly & outlier detection (Isolation Forest, One-Class SVM, LOF) is:</p>
    <div class="formula-box">$$s(x)=\lVert x-c\rVert_2$$</div>
    <p>Here $c$ is a learned center or local reference, and a large score $s(x)$ means the point is unusual under that reference.</p>
    <p><b>A tiny numeric pass.</b> The purpose of the arithmetic is not to be large; it is to make the mechanism visible enough that you can audit it by hand.</p>
    <ol class="work">
      <li>normal-center estimate: $[(0+0.2+0)/3,(0+0+0.1)/3]=[0.067,0.033]$</li>
      <li>outlier score for $[4,4]$: $\sqrt{(4-0.067)^2+(4-0.033)^2}=5.586$</li>
      <li>largest normal score is $0.137$, so the outlier is clearly separated</li>
    </ol>
    <p>The number is a decision, not decoration: it decides which point joins which representative, which neighbor receives influence, which component owns a datum, which direction is kept, or which rule deserves attention. That is why unsupervised learning is so sensitive to scaling and preprocessing — the calculation only sees the quantities we give it.</p>
    <p><b>Shape bookkeeping.</b> In a toy matrix with $m=4$ examples and $n=2$ measured coordinates, a two-dimensional method starts with $X\in\mathbb{R}^{4\times2}$. A one-dimensional representation returns $Z\in\mathbb{R}^{4\times1}$; a two-cluster representation returns labels in $\{0,1\}^4$; a pairwise graph returns an affinity matrix in $\mathbb{R}^{4\times4}$. Keeping those shapes straight prevents most implementation bugs.</p>`,
  pitfalls: String.raw`
    <ul>
      <li><b>Unscaled features silently dominate.</b> Every distance, kernel, factorization, or score above is computed on the numeric scale you provide; a large-unit feature can become the whole lesson's mechanism by accident.</li>
      <li><b>Treating the output as ground truth.</b> The algorithm optimizes its own criterion, not a hidden label; if the criterion is misaligned, the structure can be clean and still irrelevant.</li>
      <li><b>Forgetting stability checks.</b> Rerun with nearby hyperparameters or resampled data; if the arithmetic flips under tiny changes, the discovered pattern is a fragile artifact.</li>
      <li><b>Evaluating with the training objective only.</b> A lower objective can mean a better fit to noise. Use external knowledge, held-out reconstruction, or the evaluation tools in (4.11) whenever possible.</li>
    </ul>`
};

/* ---------------- 4.25 Kernel Density Estimation ---------------- */
window.ALLML_CONTENT["4.25"] = {
  tagline: "Kernel Density Estimation turns unlabeled data into structure by choosing the right notion of similarity, compression, or surprise.",
  colab: "https://colab.research.google.com/github/niamleeson/ml-math/blob/main/notebooks/4.25-kernel-density-estimation.ipynb",
  context: String.raw`
    <p>Part 4 moves from prediction with labels to discovery without labels. Probability normalization and distance-based kernels become the way local influence is measured.</p>
    <ul>
      <li><b>Geometry</b> supplies distances, neighborhoods, projections, and matrix shapes; those are the objects Kernel Density Estimation actually manipulates.</li>
      <li><b>Optimization</b> supplies the repeated move: assign, weight, factor, or score, then improve the quantity written in the Mathematics section.</li>
      <li><b>Probability</b> supplies normalization whenever several explanations compete for the same point.</li>
    </ul>
    <p>Where it leads: this lesson supports later representation learning, retrieval, anomaly monitoring, and evaluation. The ideas here are reused by supervised feature engineering, deep embeddings in Part 6, and recommender systems in later applied lessons.</p>`,
  intuition: String.raw`
    <p>The concrete problem is simple to state and hard to do honestly: unlabeled data contains patterns, but no teacher tells us which pattern is real. Kernel Density Estimation gives one disciplined way to make that hidden structure visible.</p>
    <p>The naive approach is to stare at a scatterplot or choose groups by hand. That fails as soon as the dimension rises, the clusters overlap, or the structure is not a round blob. The mental model is to replace visual judgment with a computable criterion: a distance, a weight, a graph, a factorization, a density, or a rule count.</p>
    <p>The design decision people gloss over is the choice of <b>what counts as close or explanatory</b>. Change that choice and the same data can produce different structure. A wise unsupervised workflow therefore treats the algorithm as a lens, not an oracle: it reveals the structure that its criterion is able to see.</p>`,
  mathematics: String.raw`
    <p>The core computation for Kernel Density Estimation is:</p>
    <div class="formula-box">$$p_i=\frac{\exp(-d_i^2/2h^2)}{\sum_j\exp(-d_j^2/2h^2)}$$</div>
    <p>Here $d_i$ is a distance from the query, $h$ is the locality scale, and $p_i$ is the normalized influence weight.</p>
    <p><b>A tiny numeric pass.</b> The purpose of the arithmetic is not to be large; it is to make the mechanism visible enough that you can audit it by hand.</p>
    <ol class="work">
      <li>with $h=1$ and distances $[1,0,1]$, exponentials are $[e^{-0.5},e^0,e^{-0.5}]=[0.607,1.000,0.607]$</li>
      <li>sum the weights: $0.607+1.000+0.607=2.213$</li>
      <li>the middle point gets $1.000/2.213=0.452$ of the influence</li>
    </ol>
    <p>The number is a decision, not decoration: it decides which point joins which representative, which neighbor receives influence, which component owns a datum, which direction is kept, or which rule deserves attention. That is why unsupervised learning is so sensitive to scaling and preprocessing — the calculation only sees the quantities we give it.</p>
    <p><b>Shape bookkeeping.</b> In a toy matrix with $m=4$ examples and $n=2$ measured coordinates, a two-dimensional method starts with $X\in\mathbb{R}^{4\times2}$. A one-dimensional representation returns $Z\in\mathbb{R}^{4\times1}$; a two-cluster representation returns labels in $\{0,1\}^4$; a pairwise graph returns an affinity matrix in $\mathbb{R}^{4\times4}$. Keeping those shapes straight prevents most implementation bugs.</p>`,
  pitfalls: String.raw`
    <ul>
      <li><b>Unscaled features silently dominate.</b> Every distance, kernel, factorization, or score above is computed on the numeric scale you provide; a large-unit feature can become the whole lesson's mechanism by accident.</li>
      <li><b>Treating the output as ground truth.</b> The algorithm optimizes its own criterion, not a hidden label; if the criterion is misaligned, the structure can be clean and still irrelevant.</li>
      <li><b>Forgetting stability checks.</b> Rerun with nearby hyperparameters or resampled data; if the arithmetic flips under tiny changes, the discovered pattern is a fragile artifact.</li>
      <li><b>Evaluating with the training objective only.</b> A lower objective can mean a better fit to noise. Use external knowledge, held-out reconstruction, or the evaluation tools in (4.11) whenever possible.</li>
    </ul>`
};

/* ---------------- 4.26 Association rule mining (Apriori, FP-growth) ---------------- */
window.ALLML_CONTENT["4.26"] = {
  tagline: "Association rule mining (Apriori, FP-growth) turns unlabeled data into structure by choosing the right notion of similarity, compression, or surprise.",
  colab: "https://colab.research.google.com/github/niamleeson/ml-math/blob/main/notebooks/4.26-association-rule-mining.ipynb",
  context: String.raw`
    <p>Part 4 moves from prediction with labels to discovery without labels. Counting itemsets becomes probabilistic evidence for rules that appear more often than chance would suggest.</p>
    <ul>
      <li><b>Geometry</b> supplies distances, neighborhoods, projections, and matrix shapes; those are the objects Association rule mining (Apriori, FP-growth) actually manipulates.</li>
      <li><b>Optimization</b> supplies the repeated move: assign, weight, factor, or score, then improve the quantity written in the Mathematics section.</li>
      <li><b>Probability</b> supplies normalization whenever several explanations compete for the same point.</li>
    </ul>
    <p>Where it leads: this lesson supports later representation learning, retrieval, anomaly monitoring, and evaluation. The ideas here are reused by supervised feature engineering, deep embeddings in Part 6, and recommender systems in later applied lessons.</p>`,
  intuition: String.raw`
    <p>The concrete problem is simple to state and hard to do honestly: unlabeled data contains patterns, but no teacher tells us which pattern is real. Association rule mining (Apriori, FP-growth) gives one disciplined way to make that hidden structure visible.</p>
    <p>The naive approach is to stare at a scatterplot or choose groups by hand. That fails as soon as the dimension rises, the clusters overlap, or the structure is not a round blob. The mental model is to replace visual judgment with a computable criterion: a distance, a weight, a graph, a factorization, a density, or a rule count.</p>
    <p>The design decision people gloss over is the choice of <b>what counts as close or explanatory</b>. Change that choice and the same data can produce different structure. A wise unsupervised workflow therefore treats the algorithm as a lens, not an oracle: it reveals the structure that its criterion is able to see.</p>`,
  mathematics: String.raw`
    <p>The core computation for Association rule mining (Apriori, FP-growth) is:</p>
    <div class="formula-box">$$support(A\Rightarrow B)=P(A\cap B),\quad confidence=P(B|A),\quad lift=\frac{P(B|A)}{P(B)}$$</div>
    <p>Here $A$ is the antecedent itemset, $B$ is the consequent, and lift compares the rule with independence.</p>
    <p><b>A tiny numeric pass.</b> The purpose of the arithmetic is not to be large; it is to make the mechanism visible enough that you can audit it by hand.</p>
    <ol class="work">
      <li>support for bread and milk: $2/4=0.500$</li>
      <li>confidence for bread $\Rightarrow$ milk: $2/3=0.667$</li>
      <li>lift with milk support $3/4$: $0.667/0.750=0.889$</li>
    </ol>
    <p>The number is a decision, not decoration: it decides which point joins which representative, which neighbor receives influence, which component owns a datum, which direction is kept, or which rule deserves attention. That is why unsupervised learning is so sensitive to scaling and preprocessing — the calculation only sees the quantities we give it.</p>
    <p><b>Shape bookkeeping.</b> In a toy matrix with $m=4$ examples and $n=2$ measured coordinates, a two-dimensional method starts with $X\in\mathbb{R}^{4\times2}$. A one-dimensional representation returns $Z\in\mathbb{R}^{4\times1}$; a two-cluster representation returns labels in $\{0,1\}^4$; a pairwise graph returns an affinity matrix in $\mathbb{R}^{4\times4}$. Keeping those shapes straight prevents most implementation bugs.</p>`,
  pitfalls: String.raw`
    <ul>
      <li><b>Unscaled features silently dominate.</b> Every distance, kernel, factorization, or score above is computed on the numeric scale you provide; a large-unit feature can become the whole lesson's mechanism by accident.</li>
      <li><b>Treating the output as ground truth.</b> The algorithm optimizes its own criterion, not a hidden label; if the criterion is misaligned, the structure can be clean and still irrelevant.</li>
      <li><b>Forgetting stability checks.</b> Rerun with nearby hyperparameters or resampled data; if the arithmetic flips under tiny changes, the discovered pattern is a fragile artifact.</li>
      <li><b>Evaluating with the training objective only.</b> A lower objective can mean a better fit to noise. Use external knowledge, held-out reconstruction, or the evaluation tools in (4.11) whenever possible.</li>
    </ul>`
};

