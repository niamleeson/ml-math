# Language Models, Machine Translation & Attention

> **Source:** Deep Learning — Stanford CS 230 &middot; Topic 25/38 &middot; [↑ Full reference](../ai-ml-cheatsheets.md)

### 2.5 Language model

- **Overview** — A language model aims at estimating the probability of a sentence $P(y)$.

- **$n$-gram model** — This model is a naive approach aiming at quantifying the probability that an expression appears in a corpus by counting its number of appearance in the training data.

- **Perplexity** — Language models are commonly assessed using the perplexity metric, also known as PP, which can be interpreted as the inverse probability of the dataset normalized by the number of words $T$. The perplexity is such that the lower, the better and is defined as follows:

$$
\boxed{\textrm{PP}=\prod_{t=1}^{T}\left(\frac{1}{\sum_{j=1}^{|V|}y_j^{(t)}\cdot \widehat{y}_j^{(t)}}\right)^{\frac{1}{T}}}
$$

_Remark: PP is commonly used in t-SNE._

### 2.6 Machine translation

- **Overview** — A machine translation model is similar to a language model except it has an encoder network placed before. For this reason, it is sometimes referred as a conditional language model. The goal is to find a sentence $y$ such that:

$$
\boxed{y=\underset{y^{<1>},...,y^{<T_y>}}{\textrm{arg max}}\;P\left(y^{<1>},...,y^{<T_y>}|x\right)}
$$

- **Beam search** — It is a heuristic search algorithm used in machine translation and speech recognition to find the likeliest sentence $y$ given an input $x$.

  - Step 1: Find top $B$ likely words $y^{<1>}$
  - Step 2: Compute conditional probabilities $y^{<k>}|x,y^{<1>},...,y^{<k-1>}$
  - Step 3: Keep top $B$ combinations $x,y^{<1>},...,y^{<k>}$

*[Figure: Beam search decoding diagram. An encoder processes the final input state $x^{<T_x>}$, the decoder first finds the top $B$ likely first words $y^{<1>}$, then repeatedly computes conditional probabilities for $y^{<k>}|x,y^{<1>},...,y^{<k-1>}$, keeps the top $B$ partial combinations $x,y^{<1>},...,y^{<k>}$, and continues until an end-of-sentence token $y^{<T_y>}=\langle\textrm{EOS}\rangle$ stops the process; dashed boxes mark repeated beam-expansion stages.]*


Remark: if the beam width is set to 1, then this is equivalent to a naive greedy search.

- **Beam width** — The beam width $B$ is a parameter for beam search. Large values of $B$ yield to better result but with slower performance and increased memory. Small values of $B$ lead to worse results but is less computationally intensive. A standard value for $B$ is around 10.

- **Length normalization** — In order to improve numerical stability, beam search is usually applied the following normalized objective, often called the normalized log-likelihood objective, defined as:

$$
\textrm{Objective} = \frac{1}{T_y^\alpha}\sum_{t=1}^{T_y}\log\left[p\left(y^{<t>}\mid x,y^{<1>},...,y^{<t-1>}\right)\right]
$$

Remark: the parameter $\alpha$ can be seen as a softener, and its value is usually between 0.5 and 1.

- **Error analysis** — When obtaining a predicted translation $\hat{y}$ that is bad, one can wonder why we did not get a good translation $y^*$ by performing the following error analysis:

| Case | $P(y^*\mid x) > P(\hat{y}\mid x)$ | $P(y^*\mid x) \leq P(\hat{y}\mid x)$ |
|---|---|---|
| **Root cause** | Beam search faulty | RNN faulty |
| **Remedies** | Increase beam width | - Try different architecture<br>- Regularize<br>- Get more data |

- **Bleu score** — The bilingual evaluation understudy (bleu) score quantifies how good a machine translation is by computing a similarity score based on $n$-gram precision. It is defined as follows:

$$
\textrm{bleu score} = \exp\left(\frac{1}{n}\sum_{k=1}^{n}p_k\right)
$$

where $p_n$ is the bleu score on $n$-gram only defined as follows:

$$
p_n = \frac{\sum_{\textrm{n-gram}\in\hat{y}}\textrm{count}_{\textrm{clip}}(\textrm{n-gram})}{\sum_{\textrm{n-gram}\in\hat{y}}\textrm{count}(\textrm{n-gram})}
$$

Remark: a brevity penalty may be applied to short predicted translations to prevent an artificially inflated bleu score.

### 2.7 Attention

- **Attention model** — This model allows an RNN to pay attention to specific parts of the input that is considered as being important, which improves the performance of the resulting model in practice. By noting $\alpha^{<t,t'>}$ the amount of attention that the output $y^{<t>}$ should pay to activation $a^{<t'>}$ and $c^{<t>}$ the context at time $t$, we have:

$$
c^{<t>} = \sum_{t'}\alpha^{<t,t'>}a^{<t'>} \quad \textrm{with} \quad \sum_{t'}\alpha^{<t,t'>}=1
$$

Remark: the attention scores are commonly used in image captioning and machine translation.

*[Figure: Two teddy-bear image-captioning examples illustrate visual attention. In the left image, a bright attention spot is centered on the teddy bear's face while the caption reads “A cute teddy bear is reading Persian literature,” with “A cute teddy bear” emphasized; in the right image, the attention spot is on the open book while the same caption emphasizes “reading Persian literature.” The purpose is to show that an attention model focuses on different image regions for different generated words.]*

- **Attention weight** — The amount of attention that the output $y^{<t>}$ should pay to the activation $a^{<t'>}$ is given by $\alpha^{<t,t'>}$ computed as follows:

$$
\alpha^{<t,t'>} = \frac{\exp(e^{<t,t'>})}{\sum_{t''=1}^{T_x}\exp(e^{<t,t''>})}
$$

Remark: computation complexity is quadratic with respect to $T_x$.

* * *
