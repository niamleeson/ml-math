# Language Models, Machine Translation & Attention
> **Source:** CS 230 · **Category:** Model/Method · **Type:** 💻 Colab · [↑ Full reference](../../ai-ml-cheatsheets.md)
> 📓 Runnable notebook section; an .ipynb will be generated.

## 1. Overview

Language models estimate probabilities of token sequences, machine translation models estimate target-sentence probabilities conditioned on source sentences, and attention lets a decoder focus on the source positions that matter at each output step.

**One-line intuition:** translation is search over sentences: a conditional language model scores candidates, attention supplies context, beam search keeps promising partial translations, and perplexity/BLEU diagnose quality.

## 2. Key Idea

### Language models and perplexity

A language model factors a sentence probability into next-token probabilities:

$$
P(y)=\prod_{t=1}^{T}P\left(y^{<t>}\mid y^{<1>},\ldots,y^{<t-1>}\right).
$$

An $n$-gram model approximates the full history with the previous $n-1$ tokens. A bigram model is:

$$
P(y^{<t>}\mid y^{<1:t-1>})\approx P(y^{<t>}\mid y^{<t-1>}).
$$

Perplexity is inverse probability normalized by sequence length:

$$
\operatorname{PP}=\left(\prod_{t=1}^{T}\frac{1}{p_t}\right)^{1/T}
=\exp\left(-\frac{1}{T}\sum_{t=1}^{T}\log p_t\right),
$$

where $p_t$ is the model probability assigned to the correct token at step $t$. Lower is better.

### Machine translation and search

Machine translation is conditional language modeling:

$$
y^*=\operatorname*{argmax}_{y^{<1>},\ldots,y^{<T_y>}}
P\left(y^{<1>},\ldots,y^{<T_y>}\mid x\right).
$$

```text
Greedy decoding
prefix = []
repeat:
  choose argmax_token P(token | x, prefix)
  append token to prefix
  stop if token is EOS
return prefix
```

```text
Beam search with width B
beam = [empty prefix with log score 0]
repeat:
  expand every prefix by every next token
  add log probabilities to prefix scores
  keep the top B partial translations
  stop if all kept translations end in EOS
return best completed translation
```

Beam search often uses length normalization:

$$
\operatorname{score}(y\mid x)=
\frac{1}{T_y^\alpha}\sum_{t=1}^{T_y}
\log P\left(y^{<t>}\mid x,y^{<1:t-1>}\right),\quad 0.5\le \alpha\le 1.
$$

### Attention

Dot-product attention compares a decoder query $q$ to encoder keys $k_i$, normalizes scores with softmax, and returns a weighted sum of values $v_i$:

$$
e_i=q\cdot k_i,\qquad
\alpha_i=\frac{\exp(e_i)}{\sum_j\exp(e_j)},\qquad
c=\sum_i \alpha_i v_i.
$$

Scaled dot-product attention is:

$$
\operatorname{Attention}(Q,K,V)=\operatorname{softmax}\left(\frac{QK^\top}{\sqrt{d_k}}\right)V.
$$

### BLEU

BLEU uses clipped $n$-gram precision and a brevity penalty:

$$
p_n=\frac{\sum_g \min(\operatorname{count}_{cand}(g),\operatorname{count}_{ref}(g))}
{\sum_g \operatorname{count}_{cand}(g)},\qquad
BLEU=BP\cdot\exp\left(\frac{1}{N}\sum_{n=1}^{N}\log p_n\right).
$$

If a good translation $y^*$ has higher model probability than the bad output $\hat y$, beam search was faulty; if not, the model was faulty.

## 3. Hands-on Notebook

### Setup

Run this first. The install line is commented because Colab usually has these packages; every dataset below is hardcoded and CPU-only.

```python
# !pip -q install numpy matplotlib ipywidgets  # install only lightweight notebook packages if Colab is missing them.
import math  # use scalar math for square roots, logarithms, and BLEU brevity penalties.
import numpy as np  # use NumPy arrays for probability tables, vectors, matrices, and attention.
import matplotlib.pyplot as plt  # use Matplotlib for probability bars, search traces, and attention heatmaps.
from collections import Counter, defaultdict  # use count tables for n-gram language models and BLEU.
try:  # try real widgets so the final experiment is interactive in Colab.
    from ipywidgets import interact, FloatSlider, IntSlider, Dropdown  # import controls for temperature and beam-width sliders.
except ModuleNotFoundError:  # keep the notebook runnable in environments without ipywidgets.
    class _FallbackWidget:  # define a tiny object that stores the default widget value.
        def __init__(self, value=None, **kwargs):  # accept widget-like keyword arguments without needing ipywidgets.
            self.value = value  # save the default value so the fallback can call the function once.
    FloatSlider = _FallbackWidget  # replace floating sliders with the fallback holder.
    IntSlider = _FallbackWidget  # replace integer sliders with the fallback holder.
    Dropdown = _FallbackWidget  # replace dropdown menus with the fallback holder.
    def interact(function, **controls):  # define a fallback interaction runner.
        values = {name: control.value for name, control in controls.items()}  # collect default values from controls.
        return function(**values)  # call the function once so the notebook still runs top-to-bottom.
np.random.seed(230)  # seed legacy NumPy randomness for reproducible examples.
RNG = np.random.default_rng(230)  # create a modern random generator for toy sampling.
plt.style.use("seaborn-v0_8-whitegrid")  # use a clean plotting style for lecture visuals.
EPS = 1e-12  # use a tiny probability floor so logarithms never see zero.

def softmax(scores, temperature=1.0):  # create the normalizer used by attention and decoding.
    scaled = np.asarray(scores, dtype=float) / temperature  # apply temperature so low values sharpen and high values smooth.
    shifted = scaled - np.max(scaled)  # subtract the maximum to prevent exponential overflow.
    exp_values = np.exp(shifted)  # exponentiate scores so all unnormalized weights are positive.
    return exp_values / exp_values.sum()  # normalize the weights so they sum to one.

def perplexity_from_probs(probs):  # compute perplexity from correct-token probabilities.
    safe_probs = np.clip(np.asarray(probs, dtype=float), EPS, 1.0)  # clip probabilities to avoid log zero.
    return float(np.exp(-np.mean(np.log(safe_probs))))  # exponentiate average negative log probability.

def tokenize(sentence):  # define a transparent tokenizer for tiny examples.
    cleaned = sentence.lower().replace(".", "").replace(",", "")  # remove punctuation that is not part of the concepts.
    return cleaned.split()  # split on whitespace so token boundaries are inspectable.

def ngrams(tokens, n):  # extract contiguous n-grams.
    return [tuple(tokens[i:i + n]) for i in range(len(tokens) - n + 1)]  # slide a width-n window through tokens.

def plot_bar(labels, values, title, ylabel="probability", color="steelblue"):  # reuse one categorical plotting helper.
    plt.figure(figsize=(6.5, 4.0))  # create a compact figure for notebook readability.
    plt.bar(labels, values, color=color, alpha=0.85)  # draw bars so relative magnitudes are easy to compare.
    plt.title(title)  # label the specific concept being visualized.
    plt.ylabel(ylabel)  # label the vertical axis with the plotted quantity.
    plt.xticks(rotation=20, ha="right")  # rotate token labels to avoid overlap.
    plt.ylim(0, max(values) * 1.25 + 0.02)  # leave headroom above the largest bar.
    plt.show()  # render the plot.

def build_bigram_model(sentences, alpha=0.5):  # fit a smoothed bigram language model.
    tokenized = [["<s>"] + tokenize(sentence) + ["<eos>"] for sentence in sentences]  # add start and end markers.
    vocab = sorted({token for sentence in tokenized for token in sentence})  # collect all tokens into a vocabulary.
    unigram_counts = Counter(token for sentence in tokenized for token in sentence[:-1])  # count previous-token contexts.
    bigram_counts = Counter(pair for sentence in tokenized for pair in ngrams(sentence, 2))  # count adjacent token pairs.
    probs = defaultdict(dict)  # create a nested dictionary for conditional probabilities.
    for prev in vocab:  # create one probability row per possible previous token.
        denominator = unigram_counts[prev] + alpha * len(vocab)  # smooth the denominator by vocabulary size.
        for nxt in vocab:  # assign probability mass to every next token.
            numerator = bigram_counts[(prev, nxt)] + alpha  # smooth each observed or unseen bigram count.
            probs[prev][nxt] = numerator / denominator  # store P(next token given previous token).
    return tokenized, vocab, unigram_counts, bigram_counts, probs  # return tables so examples can inspect them.

def sentence_prob_trace(sentence, bigram_probs):  # score a sentence and keep every conditional probability.
    tokens = ["<s>"] + tokenize(sentence) + ["<eos>"]  # add boundaries to match training.
    trace = []  # store previous token, next token, and probability.
    for prev, nxt in ngrams(tokens, 2):  # walk through every adjacent token pair.
        prob = bigram_probs[prev][nxt]  # look up the smoothed bigram probability.
        trace.append((prev, nxt, prob))  # save the local prediction for inspection.
    return trace  # return the full scoring trace.

def toy_translation_logits(prefix):  # define a tiny conditional translation model with handcoded logits.
    table = {  # store next-token logits by output prefix.
        (): (["j", "je", "les"], np.array([3.0, 2.1, 0.2])),  # prefer a French start for the empty prefix.
        ("j",): (["aime", "ai", "<eos>"], np.array([2.7, 1.5, -1.0])),  # prefer the phrase continuation j aime.
        ("j", "aime"): (["les", "des", "<eos>"], np.array([2.4, 1.2, -0.2])),  # prefer plural article after aime.
        ("j", "aime", "les"): (["chats", "chiens", "<eos>"], np.array([2.5, 1.3, -0.4])),  # prefer cats for the source phrase.
        ("j", "aime", "les", "chats"): (["<eos>", "beaucoup"], np.array([3.2, 0.5])),  # strongly end after the complete translation.
        ("je",): (["aime", "suis", "<eos>"], np.array([2.0, 1.6, -0.5])),  # allow an alternate first-person path.
        ("je", "aime"): (["les", "le", "<eos>"], np.array([2.2, 1.0, -0.2])),  # allow a grammatically plausible path.
        ("je", "aime", "les"): (["chats", "chat", "<eos>"], np.array([2.1, 1.0, -0.4])),  # allow an alternate cats ending.
        ("je", "aime", "les", "chats"): (["<eos>", "bien"], np.array([2.7, 0.7])),  # end the alternate translation.
    }  # close the table of prefix-conditioned logits.
    return table.get(tuple(prefix), (["<eos>"], np.array([1.0])))  # default to EOS for unknown prefixes.

def greedy_decode(next_logit_fn, max_steps=6, temperature=1.0):  # implement greedy decoding for a toy next-token model.
    prefix = []  # start with no generated target tokens.
    total_logprob = 0.0  # accumulate log probabilities to score the path.
    rows = []  # keep a readable trace of each decision.
    for step in range(max_steps):  # stop after a fixed length if EOS never appears.
        tokens, logits = next_logit_fn(tuple(prefix))  # request logits conditioned on the current prefix.
        probs = softmax(logits, temperature=temperature)  # convert logits to probabilities.
        idx = int(np.argmax(probs))  # choose the locally most likely token.
        token = tokens[idx]  # convert the chosen index into a token string.
        total_logprob += float(np.log(probs[idx] + EPS))  # add the token's log probability to the path score.
        rows.append((step + 1, tuple(prefix), token, float(probs[idx]), total_logprob))  # record the decision.
        prefix.append(token)  # append the token so the next step is conditioned on it.
        if token == "<eos>":  # check whether generation is complete.
            break  # stop decoding after the end token.
    return prefix, total_logprob, rows  # return output tokens, score, and trace.

def beam_search(next_logit_fn, beam_width=3, max_steps=6, alpha=0.0, temperature=1.0):  # implement beam search from scratch.
    beam = [(tuple(), 0.0)]  # initialize the beam with an empty prefix and zero log score.
    history = []  # store candidate expansions at each timestep.
    for step in range(max_steps):  # expand the beam for a bounded number of steps.
        candidates = []  # collect all possible one-token extensions.
        for prefix, score in beam:  # expand each surviving hypothesis.
            if prefix and prefix[-1] == "<eos>":  # do not extend completed translations.
                candidates.append((prefix, score))  # preserve completed hypotheses for ranking.
                continue  # skip next-token expansion for ended sequences.
            tokens, logits = next_logit_fn(prefix)  # get possible next tokens and logits.
            probs = softmax(logits, temperature=temperature)  # normalize logits into probabilities.
            for token, prob in zip(tokens, probs):  # make one candidate per next token.
                new_prefix = prefix + (token,)  # append the token to the prefix.
                new_score = score + float(np.log(prob + EPS))  # add log probability for sequence scoring.
                candidates.append((new_prefix, new_score))  # save the expanded hypothesis.
        def normalized_score(item):  # define the beam ranking objective.
            content_length = max(1, len([tok for tok in item[0] if tok != "<eos>"]))  # count non-EOS tokens for length normalization.
            return item[1] / (content_length ** alpha)  # divide by length power when alpha is positive.
        beam = sorted(candidates, key=normalized_score, reverse=True)[:beam_width]  # keep only the top B hypotheses.
        history.append((step + 1, candidates, beam))  # store the full candidate list and pruned beam.
        if all(prefix and prefix[-1] == "<eos>" for prefix, _ in beam):  # stop if every beam has ended.
            break  # terminate search early because all hypotheses are complete.
    best = max(beam, key=lambda item: item[1] / (max(1, len([tok for tok in item[0] if tok != "<eos>"])) ** alpha))  # choose the highest-ranked final beam.
    return best, beam, history  # return best hypothesis, final beam, and step history.

def clipped_bleu(candidate, references, max_n=2):  # compute BLEU with clipped n-gram precision.
    cand_tokens = tokenize(candidate)  # tokenize the candidate translation.
    ref_tokens = [tokenize(ref) for ref in references]  # tokenize every reference translation.
    precisions = []  # store precision values for each n-gram order.
    details = {}  # store count details for transparent inspection.
    for n in range(1, max_n + 1):  # evaluate each n-gram order.
        cand_counts = Counter(ngrams(cand_tokens, n))  # count candidate n-grams.
        max_ref_counts = Counter()  # keep maximum reference counts per n-gram.
        for ref in ref_tokens:  # inspect every reference.
            ref_counts = Counter(ngrams(ref, n))  # count reference n-grams.
            for gram, count in ref_counts.items():  # compare each reference n-gram count.
                max_ref_counts[gram] = max(max_ref_counts[gram], count)  # clip by the best matching reference count.
        clipped = {gram: min(count, max_ref_counts[gram]) for gram, count in cand_counts.items()}  # compute clipped matches.
        numerator = sum(clipped.values())  # count matched clipped n-grams.
        denominator = max(1, sum(cand_counts.values()))  # count candidate n-grams while avoiding zero division.
        precision = numerator / denominator  # compute clipped precision for this order.
        precisions.append(max(precision, EPS))  # store epsilon-smoothed precision for logs.
        details[n] = (cand_counts, clipped, numerator, denominator, precision)  # save interpretable components.
    cand_len = len(cand_tokens)  # measure candidate length for brevity penalty.
    ref_lens = [len(ref) for ref in ref_tokens]  # measure all reference lengths.
    closest_ref_len = min(ref_lens, key=lambda r: (abs(r - cand_len), r))  # select the closest reference length.
    bp = 1.0 if cand_len > closest_ref_len else math.exp(1.0 - closest_ref_len / max(cand_len, 1))  # compute brevity penalty.
    bleu = bp * math.exp(float(np.mean(np.log(precisions))))  # combine precisions geometrically and apply BP.
    return bleu, bp, precisions, details  # return final BLEU and components.
```

### Data — swappable sources

The `DATA_SOURCE` switch mirrors real notebook practice, but all options are offline toy data. The ambiguous option is included because the method can fail when the model distribution is wrong or the search width is too small.

```python
DATA_SOURCE = "toy_translation"  # choose "toy_translation", "date_alignment", "ambiguous_translation", or "char_names".
DATASETS = {  # collect all small sources in one dictionary for easy swapping.
    "toy_translation": {"source": "i like cats", "target": "j aime les chats", "note": "literal English-to-French phrase"},  # use a clean phrase for decoding examples.
    "date_alignment": {"source": "12 jan 2026", "target": "2026 - 01 - 12", "note": "date formatting where attention should align fields"},  # use dates for attention alignment.
    "ambiguous_translation": {"source": "bank by river", "target": "rive de la riviere", "note": "ambiguous source word that exposes model/search errors"},  # use ambiguity for error analysis.
    "char_names": {"names": ["anna", "anne", "annie", "bella", "belle", "ben", "benny", "cora", "corey", "dana", "danny"], "note": "tiny character-level name corpus"},  # use names for character LM.
}  # finish the hardcoded data catalog.
selected_data = DATASETS[DATA_SOURCE]  # load the selected data source.
print("Selected source:", DATA_SOURCE)  # print the chosen source name for notebook reproducibility.
print("Description:", selected_data["note"])  # print why this source is useful.
print("Payload:", selected_data)  # print the actual tiny data so nothing is hidden.
```

### 🟢 Basics (warm-up)

#### B1. Softmax three attention scores

**Goal.** Convert raw attention scores $e=[1,2,0]$ into normalized attention weights.

```python
scores_b1 = np.array([1.0, 2.0, 0.0])  # define three raw compatibility scores from a query to three source positions.
weights_b1 = softmax(scores_b1)  # turn scores into positive weights that sum to one.
print("scores:", scores_b1)  # print raw scores so the softmax input is visible.
print("softmax weights:", np.round(weights_b1, 4))  # print normalized probabilities for comparison.
print("sum of weights:", weights_b1.sum())  # verify that attention weights form a probability distribution.
```

```python
plot_bar(["pos 1", "pos 2", "pos 3"], weights_b1, "B1: softmax over three attention scores", "attention weight", "darkorange")  # visualize the normalized attention distribution.
```

▶ What you'll see: the middle bar is tallest because score 2 is larger than scores 1 and 0, but every source position keeps nonzero weight.

👀 **Takeaway.** Attention weights are just a softmax distribution over source positions.

#### B2. One dot-product attention score and context weighted sum

**Goal.** Compute one query-key dot product, normalize fixed weights, and form one context vector.

```python
query_b2 = np.array([1.0, 0.5])  # choose a decoder query that asks for a two-dimensional feature pattern.
keys_b2 = np.array([[1.0, 0.0], [0.0, 1.0], [1.0, 1.0]])  # create three encoder keys for three source positions.
values_b2 = np.array([[2.0, 0.0], [0.0, 3.0], [2.0, 2.0]])  # create value vectors that will be averaged into context.
scores_b2 = keys_b2 @ query_b2  # compute dot products between the query and every key.
weights_b2 = softmax(scores_b2)  # normalize scores into attention weights.
context_b2 = weights_b2 @ values_b2  # compute the weighted sum of values.
print("dot-product scores:", np.round(scores_b2, 3))  # show compatibility between query and each key.
print("attention weights:", np.round(weights_b2, 3))  # show normalized focus over source positions.
print("context vector:", np.round(context_b2, 3))  # show the resulting context vector.
```

```python
plt.figure(figsize=(6.5, 4.0))  # create a bar plot comparing value components and context.
plt.bar(["context dim 1", "context dim 2"], context_b2, color="seagreen", alpha=0.85)  # plot the two context dimensions.
plt.title("B2: weighted-sum context vector")  # title the result of attention aggregation.
plt.ylabel("weighted value")  # label the vertical axis as value magnitude.
plt.show()  # render the context-vector plot.
```

▶ What you'll see: the context has both dimensions because attention blends multiple value vectors rather than selecting only one.

👀 **Takeaway.** The score decides focus; the weighted sum converts that focus into a context vector.

#### B3. Perplexity from three token probabilities

**Goal.** Compute perplexity from a short probability trace.

```python
token_probs_b3 = np.array([0.8, 0.5, 0.25])  # define probabilities assigned to three correct next tokens.
product_b3 = np.prod(token_probs_b3)  # multiply token probabilities to get sequence probability.
perplexity_b3 = perplexity_from_probs(token_probs_b3)  # compute normalized inverse probability.
print("correct-token probabilities:", token_probs_b3)  # show the probability assigned at each step.
print("sequence probability:", product_b3)  # show the raw product before length normalization.
print("perplexity:", perplexity_b3)  # show average branching-factor interpretation.
```

```python
plot_bar(["token 1", "token 2", "token 3"], token_probs_b3, "B3: probability trace used for perplexity", "correct-token probability", "slateblue")  # visualize which token contributes most surprise.
```

▶ What you'll see: the third token has the smallest probability, so it contributes the most to perplexity.

👀 **Takeaway.** Perplexity is low only when the model consistently assigns high probability to the observed tokens.


#### B4. Scale one attention score by square-root dimension

**Goal.** Compute the scaled dot-product score $q\cdot k / \sqrt{d_k}$ for one query-key pair.

```python
q_b4 = np.array([2.0, 1.0, -1.0, 0.5])  # define one four-dimensional decoder query.
k_b4 = np.array([1.0, 0.0, 2.0, -1.0])  # define one matching encoder key.
raw_score_b4 = float(q_b4 @ k_b4)  # compute the unscaled dot-product compatibility score.
d_b4 = q_b4.size  # count the key dimension used in scaled dot-product attention.
scaled_score_b4 = raw_score_b4 / math.sqrt(d_b4)  # divide by sqrt(d_k) to control score magnitude.
print("raw q·k score:", round(raw_score_b4, 3))  # show the unscaled score.
print("sqrt(d_k):", round(math.sqrt(d_b4), 3))  # show the scale factor.
print("scaled score:", round(scaled_score_b4, 3))  # show the score passed to softmax.
```

▶ What you'll see: scaling halves the score here because the key dimension is four.

👀 **Takeaway.** Scaled attention keeps large-dimensional dot products from making softmax too sharp too early.

#### B5. Attention weights over three keys

**Goal.** Use one query and three keys to produce an attention distribution over source positions.

```python
query_b5 = np.array([1.0, -1.0])  # choose one decoder query vector.
keys_b5 = np.array([[1.0, 0.0], [0.0, 1.0], [1.0, -1.0]])  # define three source-position keys.
scores_b5 = keys_b5 @ query_b5  # score each key by its dot product with the query.
weights_b5 = softmax(scores_b5)  # normalize the three scores into attention weights.
print("scores:", np.round(scores_b5, 3))  # print compatibility scores before softmax.
print("weights:", np.round(weights_b5, 3))  # print the resulting source-position weights.
print("sum:", round(weights_b5.sum(), 3))  # verify the weights form a distribution.
```

```python
plot_bar(["key 1", "key 2", "key 3"], weights_b5, "B5: attention weights over three keys", "attention weight", "teal")  # visualize focus over keys.
```

▶ What you'll see: the key most aligned with the query receives the largest probability mass.

👀 **Takeaway.** Dot products rank the keys, and softmax turns that ranking into usable attention weights.

#### B6. Greedy next-token argmax

**Goal.** Pick the next token with the largest probability from one toy language-model distribution.

```python
tokens_b6 = np.array(["cat", "dog", "<eos>"])  # define three possible next tokens.
probs_b6 = np.array([0.30, 0.55, 0.15])  # define a valid next-token probability distribution.
best_idx_b6 = int(np.argmax(probs_b6))  # find the index of the largest probability.
next_token_b6 = tokens_b6[best_idx_b6]  # map the winning index back to a token.
print("tokens:", tokens_b6)  # show candidate tokens.
print("probabilities:", probs_b6)  # show model probabilities.
print("greedy choice:", next_token_b6)  # show the argmax token.
```

```python
plot_bar(tokens_b6, probs_b6, "B6: greedy next-token choice", "probability", "mediumpurple")  # show why the chosen token wins.
```

▶ What you'll see: greedy decoding chooses `dog` because it has the largest local probability.

👀 **Takeaway.** Greedy decoding is just repeated argmax over the next-token distribution.

#### B7. Bigram probability from counts

**Goal.** Estimate one bigram probability $P(\text{cats}\mid\text{like})$ from tiny count tables.

```python
bigram_counts_b7 = {("like", "cats"): 3, ("like", "dogs"): 1}  # store observed next-token counts after the word like.
context_count_b7 = sum(bigram_counts_b7.values())  # count all times the context word like appears before another token.
prob_cats_b7 = bigram_counts_b7[("like", "cats")] / context_count_b7  # divide matching bigram count by context count.
print("count(like, cats):", bigram_counts_b7[("like", "cats")])  # print the numerator.
print("count(like, *):", context_count_b7)  # print the denominator.
print("P(cats | like):", prob_cats_b7)  # print the maximum-likelihood bigram probability.
```

▶ What you'll see: three of four continuations are `cats`, so the bigram probability is $0.75$.

👀 **Takeaway.** A bigram model estimates the next word by counting what followed the previous word before.

#### B8. Cross-entropy of one correct token

**Goal.** Compute the negative log probability assigned to one observed next token.

```python
correct_prob_b8 = 0.25  # store the model probability assigned to the correct token.
ce_b8 = -math.log(correct_prob_b8)  # compute one-token cross-entropy in nats.
print("correct-token probability:", correct_prob_b8)  # print the probability input.
print("one-token cross-entropy:", round(ce_b8, 3))  # print the surprise from that probability.
```

▶ What you'll see: assigning probability $0.25$ gives cross-entropy about $1.386$ nats.

👀 **Takeaway.** Cross-entropy is high when the model assigns low probability to the token that actually appeared.

#### B9. Temperature-scaled softmax

**Goal.** Compare the same logits under a low temperature and a high temperature.

```python
logits_b9 = np.array([2.0, 1.0, 0.0])  # define three next-token logits.
probs_cold_b9 = softmax(logits_b9, temperature=0.5)  # sharpen the distribution with a low temperature.
probs_warm_b9 = softmax(logits_b9, temperature=2.0)  # smooth the distribution with a high temperature.
print("T=0.5:", np.round(probs_cold_b9, 3))  # print the sharper probabilities.
print("T=2.0:", np.round(probs_warm_b9, 3))  # print the smoother probabilities.
```

```python
plt.figure(figsize=(6.5, 4.0))  # create a side-by-side bar comparison.
x_b9 = np.arange(len(logits_b9))  # create one position per token.
plt.bar(x_b9 - 0.18, probs_cold_b9, width=0.36, label="T=0.5")  # plot the low-temperature distribution.
plt.bar(x_b9 + 0.18, probs_warm_b9, width=0.36, label="T=2.0")  # plot the high-temperature distribution.
plt.xticks(x_b9, ["tok 1", "tok 2", "tok 3"])  # label candidate tokens.
plt.ylabel("probability")  # label the softmax output.
plt.title("B9: temperature changes softmax sharpness")  # title the comparison.
plt.legend()  # show temperature labels.
plt.show()  # render the bars.
```

▶ What you'll see: low temperature concentrates mass on the best token; high temperature spreads mass out.

👀 **Takeaway.** Temperature controls randomness without changing the logit ranking.

#### B10. Length-normalized log score

**Goal.** Compute one normalized beam-search score from three token log probabilities.

```python
log_probs_b10 = np.log(np.array([0.8, 0.6, 0.5]))  # store log probabilities for three generated tokens.
alpha_b10 = 0.7  # choose a length-normalization exponent.
raw_score_b10 = float(log_probs_b10.sum())  # sum log probabilities for the whole candidate.
norm_score_b10 = raw_score_b10 / (len(log_probs_b10) ** alpha_b10)  # divide by length^alpha to reduce short-output bias.
print("log probabilities:", np.round(log_probs_b10, 3))  # print local log scores.
print("raw log score:", round(raw_score_b10, 3))  # print the unnormalized sequence score.
print("length-normalized score:", round(norm_score_b10, 3))  # print the adjusted score.
```

▶ What you'll see: normalization makes the total log score less harsh for a longer candidate.

👀 **Takeaway.** Beam search often normalizes by length so short translations do not win only because they have fewer factors.


### 🟡 Easy Examples

#### E1. Count an n-gram language model

**Goal.** Build a smoothed bigram model from a tiny nursery-rhyme corpus.  
**We'll build this in 5 steps:** tokenize, count unigrams, count bigrams, smooth probabilities, and plot next-word predictions.

```python
corpus_e1 = ["cats chase mice", "cats chase yarn", "dogs chase cats", "mice eat cheese", "cats eat fish"]  # define a tiny offline corpus.
tokenized_e1, vocab_e1, unigram_e1, bigram_e1, probs_e1 = build_bigram_model(corpus_e1, alpha=0.5)  # fit the smoothed bigram model.
print("tokenized sentences:")  # label the tokenized output.
for sentence in tokenized_e1:  # inspect each tokenized sentence.
    print(sentence)  # print boundaries and words so counting is transparent.
```

```python
print("unigram context counts:")  # label the unigram count table.
for token, count in unigram_e1.most_common():  # print contexts in descending count order.
    print(f"{token:>6} -> {count}")  # format each context count for readability.
print("selected bigram counts:")  # label the bigram count table.
for pair, count in bigram_e1.most_common(10):  # show the most frequent adjacent pairs.
    print(f"{pair} -> {count}")  # print each bigram and its observed count.
```

```python
context_e1 = "cats"  # choose a context token whose next-word distribution is interesting.
next_probs_e1 = probs_e1[context_e1]  # extract P(next token | cats).
top_tokens_e1 = sorted(vocab_e1, key=lambda token: next_probs_e1[token], reverse=True)[:6]  # select the highest-probability next tokens.
top_values_e1 = [next_probs_e1[token] for token in top_tokens_e1]  # collect probabilities for plotting.
for token, value in zip(top_tokens_e1, top_values_e1):  # print the distribution before visualizing it.
    print(f"P({token} | {context_e1}) = {value:.3f}")  # format each conditional probability.
```

```python
plot_bar(top_tokens_e1, top_values_e1, "E1: bigram next-word probabilities after 'cats'", "P(next | cats)", "teal")  # plot the most likely next tokens.
```

▶ What you'll see: words observed after "cats" receive high probability, while smoothing leaves small mass for unseen next tokens.

👀 **Takeaway.** An $n$-gram language model is a count table plus smoothing.

#### E2. Compute perplexity on held-out text

**Goal.** Compare perplexity for a corpus-like sentence and an unlikely sentence.  
**We'll build this in 4 steps:** train, trace probabilities, compute perplexities, and visualize the comparison.

```python
train_e2 = ["cats chase mice", "cats chase yarn", "dogs chase cats", "mice eat cheese", "cats eat fish"]  # reuse a tiny training corpus.
_, _, _, _, probs_e2 = build_bigram_model(train_e2, alpha=0.5)  # train a smoothed bigram model.
good_sentence_e2 = "cats chase mice"  # define a held-out sentence that follows corpus patterns.
bad_sentence_e2 = "cheese chase dogs"  # define a sentence with less plausible transitions under the corpus.
trace_good_e2 = sentence_prob_trace(good_sentence_e2, probs_e2)  # compute conditional probabilities for the good sentence.
trace_bad_e2 = sentence_prob_trace(bad_sentence_e2, probs_e2)  # compute conditional probabilities for the bad sentence.
print("Good sentence trace:", trace_good_e2)  # print every bigram probability for the good sentence.
print("Bad sentence trace:", trace_bad_e2)  # print every bigram probability for the bad sentence.
```

```python
probs_good_e2 = [prob for _, _, prob in trace_good_e2]  # extract correct-token probabilities from the good trace.
probs_bad_e2 = [prob for _, _, prob in trace_bad_e2]  # extract correct-token probabilities from the bad trace.
pp_good_e2 = perplexity_from_probs(probs_good_e2)  # compute perplexity for the corpus-like sentence.
pp_bad_e2 = perplexity_from_probs(probs_bad_e2)  # compute perplexity for the unlikely sentence.
print(f"perplexity('{good_sentence_e2}') = {pp_good_e2:.3f}")  # print the lower expected perplexity.
print(f"perplexity('{bad_sentence_e2}') = {pp_bad_e2:.3f}")  # print the higher expected perplexity.
```

```python
plt.figure(figsize=(7, 4))  # create a probability trace plot.
plt.plot(probs_good_e2, marker="o", label="corpus-like sentence")  # show probabilities along the good sentence.
plt.plot(probs_bad_e2, marker="o", label="unlikely sentence")  # show probabilities along the bad sentence.
plt.title("E2: token probability traces")  # title the trace comparison.
plt.xlabel("bigram step")  # label each next-token prediction step.
plt.ylabel("P(correct token | previous token)")  # label the probability assigned by the model.
plt.legend()  # show which line corresponds to which sentence.
plt.show()  # render the trace plot.
```

▶ What you'll see: the corpus-like sentence keeps higher probabilities at most steps.

```python
plot_bar(["corpus-like", "unlikely"], [pp_good_e2, pp_bad_e2], "E2: perplexity comparison", "perplexity", "crimson")  # compare the final perplexities.
```

▶ What you'll see: the unlikely sentence has higher perplexity because the model is more surprised by its bigrams.

👀 **Takeaway.** Perplexity converts a probability trace into one interpretable "average surprise" number.

#### E3. Greedy decoding vs beam width 1

**Goal.** Show that greedy decoding is beam search with $B=1$.  
**We'll build this in 4 steps:** inspect first-step probabilities, run greedy, run beam width 1, and compare traces.

```python
first_tokens_e3, first_logits_e3 = toy_translation_logits(())  # get logits for the first generated token.
first_probs_e3 = softmax(first_logits_e3)  # convert first-step logits into probabilities.
for token, prob in zip(first_tokens_e3, first_probs_e3):  # print each first-step option.
    print(f"P({token} | source, empty prefix) = {prob:.3f}")  # show the local next-token distribution.
```

```python
plot_bar(first_tokens_e3, first_probs_e3, "E3: first-step translation probabilities", "probability", "purple")  # visualize the first greedy choice.
```

▶ What you'll see: the token `j` is locally most probable, so greedy starts there.

```python
greedy_tokens_e3, greedy_score_e3, greedy_rows_e3 = greedy_decode(toy_translation_logits, max_steps=6)  # decode by always choosing the local argmax.
beam1_best_e3, beam1_final_e3, beam1_history_e3 = beam_search(toy_translation_logits, beam_width=1, max_steps=6)  # decode with beam width one.
print("greedy output:", greedy_tokens_e3, "score:", round(greedy_score_e3, 3))  # print greedy output and log score.
print("beam width 1 output:", beam1_best_e3[0], "score:", round(beam1_best_e3[1], 3))  # print beam-1 output and log score.
```

```python
steps_e3 = [row[0] for row in greedy_rows_e3]  # extract timestep numbers from the greedy trace.
chosen_probs_e3 = [row[3] for row in greedy_rows_e3]  # extract chosen-token probabilities from the greedy trace.
plt.figure(figsize=(7, 4))  # create a path-probability plot.
plt.plot(steps_e3, chosen_probs_e3, marker="o", linewidth=2.5)  # plot the probability of the token chosen at each step.
plt.title("E3: greedy chosen-token probabilities")  # title the local-decision trace.
plt.xlabel("decoding step")  # label the horizontal axis by generation step.
plt.ylabel("chosen-token probability")  # label the vertical axis by local probability.
plt.show()  # render the greedy trace.
```

▶ What you'll see: each point is the local maximum chosen by greedy search; beam width 1 keeps exactly the same path.

👀 **Takeaway.** Beam width $B=1$ has no lookahead diversity, so it is greedy decoding.

#### E4. Beam search with B=3

**Goal.** Keep multiple translation hypotheses and inspect beam expansions.  
**We'll build this in 6 steps:** initialize, expand, prune, repeat, print candidates, and visualize final scores.

```python
best_e4, final_beam_e4, history_e4 = beam_search(toy_translation_logits, beam_width=3, max_steps=6)  # run beam search with three active hypotheses.
print("best translation:", " ".join(best_e4[0]), "log score:", round(best_e4[1], 3))  # print the top completed translation.
for step, candidates, beam in history_e4:  # inspect every search timestep.
    print("\\nstep", step)  # label the expansion timestep.
    print("  candidates:", [(" ".join(p), round(s, 3)) for p, s in candidates[:8]])  # print a compact candidate preview.
    print("  kept beam:", [(" ".join(p), round(s, 3)) for p, s in beam])  # print the top B survivors.
```

```python
labels_e4 = [" ".join(prefix) for prefix, _ in final_beam_e4]  # create readable labels for final beam hypotheses.
scores_e4 = [score for _, score in final_beam_e4]  # collect final log scores.
plt.figure(figsize=(8, 4.5))  # create a score comparison figure.
plt.bar(labels_e4, scores_e4, color="seagreen", alpha=0.85)  # plot log scores for the final beam candidates.
plt.title("E4: final beam candidates with B=3")  # title the beam result.
plt.ylabel("cumulative log probability")  # label the score axis.
plt.xticks(rotation=25, ha="right")  # rotate candidate labels for readability.
plt.show()  # render the final beam comparison.
```

▶ What you'll see: several plausible translations survive early, and the final top candidate has the least negative log score.

👀 **Takeaway.** Beam search trades more computation for less myopic decoding than greedy search.

#### E5. BLEU by clipped n-grams

**Goal.** Compute BLEU components for candidate/reference translations.  
**We'll build this in 5 steps:** tokenize, count n-grams, clip matches, apply brevity penalty, and plot components.

```python
candidate_e5 = "j aime les chats"  # define a candidate translation.
references_e5 = ["j aime les chats", "j adore les chats"]  # define two acceptable references.
bleu_e5, bp_e5, precisions_e5, details_e5 = clipped_bleu(candidate_e5, references_e5, max_n=2)  # compute BLEU through bigrams.
print("candidate tokens:", tokenize(candidate_e5))  # print candidate tokens.
print("reference tokens:", [tokenize(ref) for ref in references_e5])  # print reference tokens.
```

```python
for n, (cand_counts, clipped, numerator, denominator, precision) in details_e5.items():  # inspect each n-gram order.
    print(f"{n}-gram candidate counts:", cand_counts)  # print candidate n-gram counts.
    print(f"{n}-gram clipped matches:", clipped)  # print clipped matching counts.
    print(f"{n}-gram precision: {numerator}/{denominator} = {precision:.3f}")  # print the precision calculation.
print("brevity penalty:", round(bp_e5, 3))  # print BLEU's short-candidate penalty.
print("BLEU:", round(bleu_e5, 3))  # print the final BLEU score.
```

```python
plot_bar(["unigram precision", "bigram precision", "brevity penalty", "BLEU"], [precisions_e5[0], precisions_e5[1], bp_e5, bleu_e5], "E5: BLEU components", "score", "royalblue")  # visualize BLEU components.
```

▶ What you'll see: exact candidate/reference overlap gives precision and BLEU near one.

👀 **Takeaway.** BLEU rewards matching phrases but clips repeated n-grams so a candidate cannot win by repeating one good word.

### 🔴 Advanced Examples

#### A1. Character language model

**Goal.** Train a tiny character bigram model and sample names at multiple temperatures.  
**We'll build this in 8 steps:** count characters, smooth probabilities, inspect transition rows, sample characters, generate names, compare temperatures, plot entropy, and evaluate perplexity.

```python
names_a1 = DATASETS["char_names"]["names"]  # load the tiny offline name corpus.
chars_a1 = sorted(set("".join(names_a1)) | {"<s>", "<eos>"})  # build a character vocabulary with boundaries.
char_to_idx_a1 = {char: idx for idx, char in enumerate(chars_a1)}  # map each character to a matrix index.
idx_to_char_a1 = {idx: char for char, idx in char_to_idx_a1.items()}  # map indices back to characters for sampling.
counts_a1 = np.ones((len(chars_a1), len(chars_a1))) * 0.5  # initialize smoothed bigram counts so every transition is possible.
for name in names_a1:  # loop over each training name.
    sequence = ["<s>"] + list(name) + ["<eos>"]  # add start and end symbols to the character sequence.
    for prev, nxt in ngrams(sequence, 2):  # count every adjacent character transition.
        counts_a1[char_to_idx_a1[prev], char_to_idx_a1[nxt]] += 1.0  # increment the transition count.
probs_a1 = counts_a1 / counts_a1.sum(axis=1, keepdims=True)  # normalize each previous-character row into probabilities.
print("character vocabulary:", chars_a1)  # print the alphabet learned from the names.
print("number of transition rows:", probs_a1.shape[0])  # print the matrix size.
```

```python
start_row_a1 = probs_a1[char_to_idx_a1["<s>"]]  # extract probabilities for the first generated character.
plot_bar(chars_a1, start_row_a1, "A1: first-character distribution", "P(char | start)", "darkcyan")  # visualize likely first characters.
```

▶ What you'll see: first letters that appear often in the name corpus receive the largest start probabilities.

```python
def sample_name_a1(temperature=1.0, max_len=12):  # define a sampler from the character bigram model.
    current = "<s>"  # start from the boundary token.
    output = []  # collect generated characters.
    for _ in range(max_len):  # cap length so sampling always terminates.
        row = probs_a1[char_to_idx_a1[current]]  # get next-character probabilities for the current character.
        adjusted = softmax(np.log(row + EPS), temperature=temperature)  # apply temperature in logit space.
        idx = RNG.choice(len(chars_a1), p=adjusted)  # sample one next character from the adjusted distribution.
        char = idx_to_char_a1[idx]  # convert sampled index back to a character token.
        if char == "<eos>":  # stop if the model emits the end marker.
            break  # finish the sampled name.
        output.append(char)  # append the sampled character to the name.
        current = char  # condition the next step on the sampled character.
    return "".join(output)  # return the sampled character string.
```

```python
for temp in [0.5, 1.0, 1.8]:  # compare conservative, standard, and creative sampling.
    samples = [sample_name_a1(temperature=temp) for _ in range(8)]  # draw several names at this temperature.
    print(f"temperature {temp}:", samples)  # print the generated names for qualitative comparison.
```

```python
entropies_a1 = -np.sum(probs_a1 * np.log(probs_a1 + EPS), axis=1)  # compute entropy of every next-character row.
plot_bar(chars_a1, entropies_a1, "A1: next-character entropy by previous character", "entropy", "mediumpurple")  # plot uncertainty per previous character.
```

▶ What you'll see: some previous characters have low entropy because only a few continuations are likely; others are more uncertain.

```python
heldout_name_a1 = "annie"  # choose one name-like held-out string.
sequence_a1 = ["<s>"] + list(heldout_name_a1) + ["<eos>"]  # add boundaries for scoring.
heldout_probs_a1 = [probs_a1[char_to_idx_a1[prev], char_to_idx_a1[nxt]] for prev, nxt in ngrams(sequence_a1, 2)]  # collect transition probabilities.
print("held-out transition probabilities:", np.round(heldout_probs_a1, 3))  # print each probability in the name trace.
print("held-out character perplexity:", round(perplexity_from_probs(heldout_probs_a1), 3))  # compute character-level perplexity.
```

👀 **Takeaway.** A character language model is the same next-token idea as word modeling, just with smaller tokens.

#### A2. Encoder-decoder translation mini-model

**Goal.** Implement a tiny dictionary-style encoder-decoder scoring model for phrase pairs.  
**We'll build this in 9 steps:** create phrase pairs, build vocabularies, encode tokens, define conditional probabilities, decode, evaluate token accuracy, inspect errors, compare references, and plot accuracy.

```python
pairs_a2 = [("i like cats", "j aime les chats"), ("i like dogs", "j aime les chiens"), ("you like cats", "tu aimes les chats"), ("you eat fish", "tu manges du poisson")]  # define tiny phrase pairs.
source_vocab_a2 = sorted({token for src, _ in pairs_a2 for token in tokenize(src)})  # collect source vocabulary.
target_vocab_a2 = sorted({token for _, tgt in pairs_a2 for token in tokenize(tgt)} | {"<eos>"})  # collect target vocabulary plus EOS.
print("source vocab:", source_vocab_a2)  # print source tokens.
print("target vocab:", target_vocab_a2)  # print target tokens.
```

```python
lexicon_a2 = {"i": "j", "you": "tu", "like": "aime", "eat": "manges", "cats": "chats", "dogs": "chiens", "fish": "poisson"}  # define a tiny learned-looking lexicon.
function_words_a2 = {"cats": "les", "dogs": "les", "fish": "du"}  # define noun-dependent articles.
def translate_rule_a2(source_sentence):  # implement a small deterministic encoder-decoder rule.
    source_tokens = tokenize(source_sentence)  # tokenize the source sentence.
    output = []  # collect target tokens.
    if source_tokens[0] == "you":  # handle second-person subject agreement.
        output.append("tu")  # emit French second-person subject.
        verb = "aimes" if source_tokens[1] == "like" else "manges"  # choose the conjugated verb.
        output.append(verb)  # append the conjugated verb.
    else:  # handle first-person source sentences.
        output.append("j")  # emit the contracted first-person subject.
        output.append(lexicon_a2[source_tokens[1]])  # append the first-person verb form.
    noun = source_tokens[-1]  # read the final source noun.
    output.append(function_words_a2[noun])  # append the noun's article.
    output.append(lexicon_a2[noun])  # append the translated noun.
    return output  # return target tokens without EOS for readability.
```

```python
predictions_a2 = []  # store model predictions for each training pair.
accuracies_a2 = []  # store token-level accuracies.
for source, target in pairs_a2:  # evaluate every phrase pair.
    pred = translate_rule_a2(source)  # decode the source with the tiny model.
    gold = tokenize(target)  # tokenize the reference target.
    accuracy = np.mean([p == g for p, g in zip(pred, gold)])  # compute token accuracy for equal-length toy outputs.
    predictions_a2.append((" ".join(pred), target))  # save prediction/reference text.
    accuracies_a2.append(float(accuracy))  # save the numeric accuracy.
    print(source, "->", " ".join(pred), "| gold:", target, "| acc:", round(accuracy, 2))  # print the full evaluation row.
```

```python
plot_bar([src for src, _ in pairs_a2], accuracies_a2, "A2: token accuracy of tiny translation model", "token accuracy", "forestgreen")  # visualize per-example accuracy.
```

▶ What you'll see: the handcoded mini-model is perfect on examples covered by its lexicon and grammar rules.

```python
test_a2 = "i eat fish"  # define a source phrase that mixes known words in a new pattern.
pred_a2 = translate_rule_a2(test_a2)  # decode the new phrase.
print("generalization test:", test_a2, "->", " ".join(pred_a2))  # print the compositional output.
print("model limitation: the rule handles known patterns but is not a trained neural network.")  # state the boundary of the toy model.
```

👀 **Takeaway.** Encoder-decoder translation can be viewed as repeatedly predicting target tokens conditioned on the source and previous target tokens.

#### A3. Beam width and length normalization

**Goal.** Show how beam width and length normalization alter candidate rankings.  
**We'll build this in 7 steps:** define a length-biased model, run beams, compare unnormalized scores, normalize scores, plot tradeoffs, inspect speed proxy, and summarize root causes.

```python
def length_bias_logits_a3(prefix):  # define a toy model that makes short EOS too attractive.
    table = {  # store logits by prefix.
        (): (["good", "short"], np.array([2.0, 1.8])),  # make a longer good path only slightly better initially.
        ("good",): (["translation", "<eos>"], np.array([1.9, 1.1])),  # continue the good path.
        ("good", "translation"): (["<eos>", "extra"], np.array([2.3, 0.2])),  # end after a meaningful two-token phrase.
        ("short",): (["<eos>", "bad"], np.array([2.6, 0.1])),  # make the short path end very confidently.
    }  # close the prefix table.
    return table.get(tuple(prefix), (["<eos>"], np.array([1.0])))  # default to EOS.
```

```python
results_a3 = []  # collect outputs for different beam and normalization settings.
for beam_width in [1, 2, 3]:  # test several beam widths.
    for alpha in [0.0, 0.7]:  # compare no normalization with length normalization.
        best, beam, history = beam_search(length_bias_logits_a3, beam_width=beam_width, max_steps=4, alpha=alpha)  # run beam search under this setting.
        text = " ".join(best[0])  # convert the best token tuple to text.
        expansions = sum(len(cands) for _, cands, _ in history)  # count expanded candidates as a speed proxy.
        results_a3.append((beam_width, alpha, text, best[1], expansions))  # store setting, output, score, and cost proxy.
        print(f"B={beam_width}, alpha={alpha}: {text}, logscore={best[1]:.3f}, expansions={expansions}")  # print the comparison row.
```

```python
labels_a3 = [f"B={b}, a={a}" for b, a, _, _, _ in results_a3]  # create compact labels for each search configuration.
costs_a3 = [expansions for _, _, _, _, expansions in results_a3]  # extract expansion counts.
plt.figure(figsize=(8, 4))  # create the speed proxy plot.
plt.bar(labels_a3, costs_a3, color="darkorange", alpha=0.85)  # plot candidate expansions by configuration.
plt.title("A3: beam-search expansion cost proxy")  # title the computational tradeoff plot.
plt.ylabel("number of expanded candidates")  # label the vertical axis as search work.
plt.xticks(rotation=25, ha="right")  # rotate configuration labels for readability.
plt.show()  # render the cost comparison.
```

▶ What you'll see: wider beams expand more candidates, so better search costs more computation.

```python
quality_a3 = [1.0 if "good translation" in text else 0.0 for _, _, text, _, _ in results_a3]  # mark whether the semantic target was found.
plot_bar(labels_a3, quality_a3, "A3: did search find the desired longer translation?", "quality flag", "seagreen")  # visualize quality versus settings.
```

▶ What you'll see: some settings prefer a short completed path, while wider or normalized search can preserve the longer desired translation.

👀 **Takeaway.** Beam search errors can come from pruning too aggressively or from scoring objectives that favor short outputs.

#### A4. Attention heatmap for translation

**Goal.** Implement scaled dot-product attention from scratch in NumPy and visualize an alignment heatmap.  
**We'll build this in 9 steps:** define tokens, create embeddings, compute scores, scale scores, softmax rows, compute contexts, print alignment, draw heatmap, and interpret weighted values.

```python
source_tokens_a4 = ["12", "jan", "2026"]  # define source date tokens.
target_tokens_a4 = ["2026", "01", "12"]  # define target date tokens after reordering.
dim_a4 = 4  # choose a small key/query dimension for visible matrices.
key_vectors_a4 = np.array([[1.0, 0.0, 0.0, 0.2], [0.0, 1.0, 0.0, 0.2], [0.0, 0.0, 1.0, 0.2]])  # encode day, month, and year keys.
value_vectors_a4 = np.array([[12.0, 0.0], [1.0, 0.0], [2026.0, 1.0]])  # store simple values representing source content.
query_vectors_a4 = np.array([[0.0, 0.0, 1.0, 0.2], [0.0, 1.0, 0.0, 0.2], [1.0, 0.0, 0.0, 0.2]])  # query year, month, then day.
raw_scores_a4 = query_vectors_a4 @ key_vectors_a4.T  # compute all query-key dot products.
scaled_scores_a4 = raw_scores_a4 / math.sqrt(dim_a4)  # scale by sqrt(d_k) to control softmax sharpness.
attention_a4 = np.vstack([softmax(row) for row in scaled_scores_a4])  # apply softmax independently for each target step.
contexts_a4 = attention_a4 @ value_vectors_a4  # compute weighted sums of source values.
print("raw scores:\\n", np.round(raw_scores_a4, 3))  # print unscaled compatibility scores.
print("attention weights:\\n", np.round(attention_a4, 3))  # print normalized attention rows.
print("context vectors:\\n", np.round(contexts_a4, 3))  # print weighted value summaries.
```

```python
plt.figure(figsize=(6.5, 4.8))  # create an attention heatmap figure.
image = plt.imshow(attention_a4, cmap="Blues", aspect="auto", vmin=0, vmax=1)  # show attention weights as color intensity.
plt.colorbar(image, label="attention weight")  # add a colorbar so weight magnitudes are readable.
plt.xticks(range(len(source_tokens_a4)), source_tokens_a4)  # label columns with source tokens.
plt.yticks(range(len(target_tokens_a4)), target_tokens_a4)  # label rows with target tokens.
plt.xlabel("source tokens")  # label heatmap columns.
plt.ylabel("target decoder steps")  # label heatmap rows.
plt.title("A4: scaled dot-product attention heatmap")  # title the alignment visualization.
for i in range(attention_a4.shape[0]):  # annotate each heatmap cell.
    for j in range(attention_a4.shape[1]):  # visit each source position.
        plt.text(j, i, f"{attention_a4[i, j]:.2f}", ha="center", va="center", color="black")  # print the numeric weight in the cell.
plt.show()  # render the attention heatmap.
```

▶ What you'll see: target `2026` attends most to source `2026`, target `01` attends most to `jan`, and target `12` attends most to source `12`.

```python
for target, row in zip(target_tokens_a4, attention_a4):  # inspect the dominant source position for each output token.
    best_source = source_tokens_a4[int(np.argmax(row))]  # find the source token with maximum attention.
    print(f"decoder token {target!r} focuses most on source token {best_source!r}")  # print the alignment interpretation.
```

👀 **Takeaway.** Attention matrices are soft alignment tables: each decoder row distributes focus across source positions.

#### A5. Failure case — greedy/beam/attention error analysis

**Goal.** Diagnose whether a bad translation is caused by search or by the model.  
**We'll build this in 8 steps:** create ambiguous outputs, compare model probabilities, run greedy and beam, compute BLEU, inspect attention spread, classify root cause, plot evidence, and list remedies.

```python
def ambiguous_logits_a5(prefix):  # define a model that prefers the wrong sense of "bank" in context.
    table = {  # store prefix-conditioned logits.
        (): (["banque", "rive"], np.array([2.3, 1.9])),  # wrongly prefer financial-bank translation.
        ("banque",): (["pres", "de"], np.array([1.7, 1.5])),  # continue the wrong path.
        ("banque", "pres"): (["riviere", "<eos>"], np.array([2.0, 0.1])),  # make wrong phrase plausible.
        ("banque", "pres", "riviere"): (["<eos>"], np.array([2.5])),  # end the wrong phrase.
        ("rive",): (["de", "<eos>"], np.array([2.2, -0.3])),  # allow correct river-bank path.
        ("rive", "de"): (["la", "riviere"], np.array([1.6, 1.4])),  # continue correct path.
        ("rive", "de", "la"): (["riviere"], np.array([2.4])),  # complete correct phrase.
        ("rive", "de", "la", "riviere"): (["<eos>"], np.array([2.6])),  # end correct phrase.
    }  # close the ambiguous model table.
    return table.get(tuple(prefix), (["<eos>"], np.array([1.0])))  # default to EOS.
```

```python
greedy_a5, greedy_score_a5, _ = greedy_decode(ambiguous_logits_a5, max_steps=6)  # run greedy on the ambiguous model.
beam_a5, final_beam_a5, history_a5 = beam_search(ambiguous_logits_a5, beam_width=3, max_steps=6)  # run beam search with more hypotheses.
reference_a5 = "rive de la riviere"  # define the desired translation for river-bank context.
candidate_greedy_a5 = " ".join([tok for tok in greedy_a5 if tok != "<eos>"])  # remove EOS for BLEU scoring.
candidate_beam_a5 = " ".join([tok for tok in beam_a5[0] if tok != "<eos>"])  # remove EOS from beam output.
bleu_greedy_a5 = clipped_bleu(candidate_greedy_a5, [reference_a5], max_n=2)[0]  # compute BLEU for greedy output.
bleu_beam_a5 = clipped_bleu(candidate_beam_a5, [reference_a5], max_n=2)[0]  # compute BLEU for beam output.
print("greedy:", candidate_greedy_a5, "score:", round(greedy_score_a5, 3), "BLEU:", round(bleu_greedy_a5, 3))  # print greedy diagnosis.
print("beam:", candidate_beam_a5, "score:", round(beam_a5[1], 3), "BLEU:", round(bleu_beam_a5, 3))  # print beam diagnosis.
print("reference:", reference_a5)  # print the human-preferred target.
```

```python
attention_a5 = np.array([[0.34, 0.33, 0.33], [0.25, 0.35, 0.40], [0.20, 0.30, 0.50]])  # create diffuse attention over source tokens.
source_a5 = ["bank", "by", "river"]  # label ambiguous source tokens.
target_a5 = ["banque/rive", "de/pres", "riviere"]  # label target decision steps.
plt.figure(figsize=(6.5, 4.6))  # create an error-analysis heatmap.
image = plt.imshow(attention_a5, cmap="Oranges", aspect="auto", vmin=0, vmax=1)  # visualize diffuse attention weights.
plt.colorbar(image, label="attention weight")  # add a colorbar for weight interpretation.
plt.xticks(range(len(source_a5)), source_a5)  # label source columns.
plt.yticks(range(len(target_a5)), target_a5)  # label target rows.
plt.title("A5: diffuse attention in an ambiguous sentence")  # title the failure visualization.
for i in range(attention_a5.shape[0]):  # annotate rows.
    for j in range(attention_a5.shape[1]):  # annotate columns.
        plt.text(j, i, f"{attention_a5[i, j]:.2f}", ha="center", va="center", color="black")  # print each attention value.
plt.show()  # render the attention failure heatmap.
```

▶ What you'll see: attention is spread across all source tokens rather than sharply resolving that `bank` should align with the river sense.

```python
model_prefers_bad_a5 = beam_a5[1] >= -10.0 and candidate_beam_a5 != reference_a5  # check whether the model itself ranks a bad output highest.
root_cause_a5 = "model faulty" if model_prefers_bad_a5 else "beam search faulty"  # classify the CS230-style error cause.
print("root cause:", root_cause_a5)  # print the diagnosis.
print("if good translation has higher model probability: increase beam width")  # print the search-fault remedy.
print("if bad translation has higher model probability: improve architecture, data, regularization, or attention")  # print the model-fault remedies.
```

```python
plot_bar(["greedy BLEU", "beam BLEU"], [bleu_greedy_a5, bleu_beam_a5], "A5: translation quality under ambiguity", "BLEU", "crimson")  # compare output quality.
```

▶ What you'll see: both decoding strategies can score poorly when the toy model itself prefers the wrong sense of an ambiguous word.

👀 **Takeaway.** Error analysis separates search failures from model failures by comparing model probabilities of the human target and the generated output.

### Interactive Experiment

Use the sliders to change decoding behavior. Temperature changes probability sharpness; beam width changes how many partial translations survive.

```python
def interactive_decode(temperature=1.0, beam_width=3):  # define the function controlled by sliders.
    greedy_tokens, greedy_score, _ = greedy_decode(toy_translation_logits, max_steps=6, temperature=temperature)  # decode greedily at the selected temperature.
    beam_best, beam_final, _ = beam_search(toy_translation_logits, beam_width=beam_width, max_steps=6, temperature=temperature)  # decode with selected beam width.
    print("temperature:", temperature, "beam width:", beam_width)  # print current controls for reproducibility.
    print("greedy:", " ".join(greedy_tokens), "log score:", round(greedy_score, 3))  # show greedy output under the controls.
    print("beam:", " ".join(beam_best[0]), "log score:", round(beam_best[1], 3))  # show beam output under the controls.
    labels = [" ".join(prefix) for prefix, _ in beam_final]  # label final beam hypotheses.
    scores = [score for _, score in beam_final]  # collect log scores for plotting.
    plt.figure(figsize=(8, 4))  # create an interactive beam score plot.
    plt.bar(labels, scores, color="navy", alpha=0.75)  # plot scores of surviving beam hypotheses.
    plt.title("Interactive: final beam hypotheses")  # title the live plot.
    plt.ylabel("cumulative log probability")  # label the score axis.
    plt.xticks(rotation=25, ha="right")  # rotate hypothesis labels for readability.
    plt.show()  # render the live plot.

interact(  # create the interactive controls in Colab.
    interactive_decode,  # connect sliders to the decoding function.
    temperature=FloatSlider(value=1.0, min=0.4, max=2.0, step=0.1, description="temperature"),  # let learners sharpen or flatten distributions.
    beam_width=IntSlider(value=3, min=1, max=5, step=1, description="beam width"),  # let learners change search breadth.
)  # display the widget or fallback output.
```

▶ What you'll see: lower temperature sharpens local choices, higher temperature makes alternatives closer, and larger beam width preserves more candidate translations before pruning.

👀 **Takeaway.** Decoding quality is controlled by both model probabilities and search hyperparameters; neither can be understood in isolation.
