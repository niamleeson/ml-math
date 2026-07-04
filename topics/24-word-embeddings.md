# Word Embeddings: word2vec & GloVe

> **Source:** Deep Learning — Stanford CS 230 &middot; Topic 24/38 &middot; [↑ Full reference](../ai-ml-cheatsheets.md)

### 2.3 Learning word representation

In this section, we note $V$ the vocabulary and $|V|$ its size.

#### 2.3.1 Motivation and notations

- **Representation techniques** — The two main ways of representing words are summed up in the table below:

| 1-hot representation | Word embedding |
|---|---|
| *[Figure: 1-hot representation axes for words such as “teddy bear,” “soft,” and “book,” with each word lying on a separate orthogonal axis; the purpose is to show that words are isolated basis vectors with no notion of similarity.]* | *[Figure: Word embedding coordinate space with arrows for “teddy bear,” “soft,” and “book,” where teddy bear and soft point in more similar directions than book; the purpose is to show distributed vectors that capture semantic similarity.]* |
| - Noted $o_w$<br>- Naive approach, no similarity information | - Noted $e_w$<br>- Takes into account words similarity |

- **Embedding matrix** — For a given word $w$, the embedding matrix $E$ is a matrix that maps its 1-hot representation $o_w$ to its embedding $e_w$ as follows:

$$
\boxed{e_w=Eo_w}
$$

_Remark: learning the embedding matrix can be done using target/context likelihood models._

#### 2.3.2 Word embeddings

- **Word2vec** — Word2vec is a framework aimed at learning word embeddings by estimating the likelihood that a given word is surrounded by other words. Popular models include skip-gram, negative sampling and CBOW.

*[Figure: Word2vec training illustration. A proxy task sentence fragment shows context words “A cute” and “is reading” around target “teddy bear”; a neural network is trained to predict or use the target from surrounding words, then an intermediate high-level representation is extracted and used to compute word embeddings, with examples mapping “teddy bear” near “soft” and “Persian poetry” near “art.”]*

- **Skip-gram** — The skip-gram word2vec model is a supervised learning task that learns word embeddings by assessing the likelihood of any given target word $t$ happening with a context word $c$. By noting $\theta_t$ a parameter associated with $t$, the probability $P(t|c)$ is given by:

$$
\boxed{P(t|c)=\frac{\exp\left(\theta_t^Te_c\right)}{\displaystyle\sum_{j=1}^{|V|}\exp\left(\theta_j^Te_c\right)}}
$$

_Remark: summing over the whole vocabulary in the denominator of the softmax part makes this model computationally expensive. CBOW is another word2vec model using the surrounding words to predict a given word._

- **Negative sampling** — It is a set of binary classifiers using logistic regressions that aim at assessing how a given context and a given target words are likely to appear simultaneously, with the models being trained on sets of $k$ negative examples and 1 positive example. Given a context word $c$ and a target word $t$, the prediction is expressed by:

$$
\boxed{P(y=1|c,t)=\sigma\left(\theta_t^Te_c\right)}
$$

_Remark: this method is less computationally expensive than the skip-gram model._

- **GloVe** — The GloVe model, short for global vectors for word representation, is a word embedding technique that uses a co-occurence matrix $X$ where each $X_{i,j}$ denotes the number of times that a target $i$ occurred with a context $j$. Its cost function $J$ is as follows:

$$
\boxed{J(\theta)=\frac{1}{2}\sum_{i,j=1}^{|V|}f(X_{ij})\left(\theta_i^Te_j+b_i+b_j'-\log(X_{ij})\right)^2}
$$

where $f$ is a weighting function such that $X_{i,j}=0\Longrightarrow f(X_{i,j})=0$.

Given the symmetry that $e$ and $\theta$ play in this model, the final word embedding $e_w^{(\textrm{final})}$ is given by:

$$
\boxed{e_w^{(\textrm{final})}=\frac{e_w+\theta_w}{2}}
$$

_Remark: the individual components of the learned word embeddings are not necessarily interpretable._

### 2.4 Comparing words

- **Cosine similarity** — The cosine similarity between words $w_1$ and $w_2$ is expressed as follows:

$$
\boxed{\textrm{similarity}=\frac{w_1\cdot w_2}{\|w_1\|\textrm{ }\|w_2\|}=\cos(\theta)}
$$

_Remark: $\theta$ is the angle between words $w_1$ and $w_2$._

*[Figure: Cosine-similarity vector diagram showing two blue arrows $w_1$ and $w_2$ emanating from a common point with angle $\theta$ between them; the purpose is to illustrate that smaller angles imply larger similarity.]*

- **$t$-SNE** — $t$-SNE ($t$-distributed Stochastic Neighbor Embedding) is a technique aimed at reducing high-dimensional embeddings into a lower dimensional space. In practice, it is commonly used to visualize word vectors in the 2D space.

*[Figure: Two-dimensional $t$-SNE scatterplot of word vectors with labeled points. Related words cluster together, such as “teddy bear,” “soft,” “hug,” “kind,” “cute,” and “adorable,” while another cluster includes literature and culture terms such as “literature,” “Shahnameh,” “poem,” “poetry,” “reading,” “book,” “art,” and “knowledge”; the purpose is to visualize semantic neighborhoods after dimensionality reduction.]*
