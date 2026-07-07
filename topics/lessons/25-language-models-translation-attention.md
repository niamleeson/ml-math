# Language Models, Machine Translation & Attention
> **Source:** CS 230 · **Category:** Model/Method · **Type:** 💻 Colab · [↑ Full reference](../../ai-ml-cheatsheets.md)
> 📓 Runnable notebook section; an .ipynb will be generated.

## 0. Step-by-Step Worked Example — Start Here (Beginner Friendly)

> 🧑‍🎓 **New to this topic? Start here.** This is a gentle, fully runnable walkthrough that
> builds up *every* idea in this lesson one tiny step at a time. Each step **prints** the
> numbers it computes and **draws a picture** so you can *see* what is happening. Run the
> cells in order from top to bottom. Nothing here needs the internet or any downloaded data.

**What we will build, step by step:**
1. **Language models and perplexity** — multiply next-token probabilities and measure surprise.
2. **Machine translation and search** — compare greedy decoding with beam search.
3. **Attention** — turn query-key scores into source-position weights and a context vector.
4. **BLEU** — combine clipped n-gram precision with a brevity penalty.

### Step 0 — Set up our tools

We import NumPy (arrays + probabilities) and Matplotlib (pictures). We fix a random **seed** so
any random-looking values stay the same every run. We also define a tiny `log()` helper so every
step prints a clearly labeled line.

```python
import numpy as np                       # NumPy: arrays, probabilities, vector math, and reproducible toy data.
import matplotlib.pyplot as plt          # Matplotlib: draw bars, paths, and attention heatmaps.

np.random.seed(0)                         # Fix the seed so every run prints the SAME numbers.
plt.rcParams["figure.figsize"] = (7, 4)   # A comfortable default plot size.

def log(label, value):                    # A tiny logger so each printed line explains itself.
    print(f"[{label}] {value}")           # Format is: [what this is] the value.

log("setup", "tools ready — NumPy + Matplotlib imported, seed fixed to 0")  # Confirm setup ran.
```
▶ What you'll see: one line confirming the tools are ready.

### Step 1 — Language models and perplexity: score a sentence token by token

A language model gives a sentence a probability by multiplying the probabilities of the correct
next token at each step. Perplexity is the same information on an easier scale: lower perplexity
means the model was less surprised by the sentence.

```python
contexts_demo = np.array(["<s>", "i", "like", "cats"])  # Previous-token contexts for scoring "i like cats <eos>".
vocab_demo = np.array(["i", "like", "cats", "dogs", "<eos>"])  # Tiny next-token vocabulary.
target_tokens_demo = np.array(["i", "like", "cats", "<eos>"])  # The correct next token in each context.
strong_table_demo = np.array([[0.72, 0.10, 0.06, 0.04, 0.08], [0.06, 0.70, 0.08, 0.06, 0.10], [0.05, 0.08, 0.68, 0.14, 0.05], [0.04, 0.04, 0.06, 0.06, 0.80]])  # A confident model for this sentence.
weak_table_demo = np.array([[0.30, 0.22, 0.16, 0.14, 0.18], [0.18, 0.28, 0.20, 0.16, 0.18], [0.14, 0.18, 0.30, 0.24, 0.14], [0.16, 0.15, 0.18, 0.15, 0.36]])  # A less confident model.
target_indices_demo = np.array([np.where(vocab_demo == token_demo)[0][0] for token_demo in target_tokens_demo])  # Convert correct tokens to columns.
strong_probs_demo = strong_table_demo[np.arange(len(contexts_demo)), target_indices_demo]  # Select correct-token probabilities.
weak_probs_demo = weak_table_demo[np.arange(len(contexts_demo)), target_indices_demo]  # Select the same probabilities for the weak model.
strong_sentence_prob_demo = np.prod(strong_probs_demo)  # Multiply conditionals into one sentence probability.
weak_sentence_prob_demo = np.prod(weak_probs_demo)  # Multiply the weak model conditionals too.
strong_ppl_demo = np.exp(-np.mean(np.log(np.clip(strong_probs_demo, 1e-12, 1.0))))  # Convert average surprise into perplexity.
weak_ppl_demo = np.exp(-np.mean(np.log(np.clip(weak_probs_demo, 1e-12, 1.0))))  # Compute the weak model perplexity.
log("contexts", contexts_demo)  # Print the conditioning words.
log("correct next tokens", target_tokens_demo)  # Print the observed path.
log("strong correct-token probabilities", np.round(strong_probs_demo, 3))  # Show local probabilities for the good model.
log("weak correct-token probabilities", np.round(weak_probs_demo, 3))  # Show local probabilities for the weak model.
log("sentence probabilities", np.round([strong_sentence_prob_demo, weak_sentence_prob_demo], 5))  # Compare products.
log("perplexities (lower is better)", np.round([strong_ppl_demo, weak_ppl_demo], 3))  # Compare normalized surprise.

x_demo = np.arange(len(target_tokens_demo))  # One x-position per predicted token.
plt.plot(x_demo, strong_probs_demo, "o-", label="strong model")  # Draw the good model's probability trace.
plt.plot(x_demo, weak_probs_demo, "o-", label="weak model")  # Draw the weak model's probability trace.
plt.xticks(x_demo, target_tokens_demo)  # Label each step by the correct token.
plt.ylim(0.0, 1.0)  # Probabilities live between 0 and 1.
plt.xlabel("correct next token")  # Label the token axis.
plt.ylabel("model probability")  # Label the probability axis.
plt.title("Language modeling: correct-token probability trace")  # Explain the plot.
plt.legend()  # Show which line is which model.
plt.show()  # Render the probability trace.

plt.bar(["strong model", "weak model"], [strong_ppl_demo, weak_ppl_demo], color=["seagreen", "salmon"])  # Plot perplexity bars.
plt.ylabel("perplexity")  # Label the surprise scale.
plt.title("Lower perplexity means less average surprise")  # Explain the comparison.
plt.show()  # Render the perplexity chart.
```
▶ What you'll see: the stronger model assigns larger probabilities to the correct tokens, so its sentence probability is higher and its perplexity bar is lower.

### Step 2 — Machine translation and search: greedy can miss the best whole sentence

A translation model scores target sentences one token at a time, but the goal is a good **whole**
sentence. Greedy decoding keeps only the local best token; beam search keeps several partial
translations so a slightly worse first token can still win later.

```python
def next_options_demo(prefix_demo):  # Tiny prefix-conditioned translation model.
    table_demo = {(): (["le", "la"], [0.60, 0.40]), ("le",): (["chat", "chien"], [0.45, 0.55]), ("la",): (["chatte", "maison"], [0.90, 0.10]), ("le", "chien"): (["<eos>"], [0.50]), ("le", "chat"): (["<eos>"], [0.45]), ("la", "chatte"): (["<eos>"], [0.95]), ("la", "maison"): (["<eos>"], [0.30])}  # Probabilities by prefix.
    tokens_demo, probs_demo = table_demo.get(tuple(prefix_demo), (["<eos>"], [1.0]))  # Default unknown prefixes to EOS.
    return np.array(tokens_demo), np.array(probs_demo, dtype=float)  # Return arrays for scoring.

greedy_prefix_demo = []  # Start greedy decoding with an empty target prefix.
greedy_logprob_demo = 0.0  # Accumulate the greedy log score.
for step_demo in range(3):  # Decode at most three tokens in this toy example.
    tokens_demo, probs_demo = next_options_demo(greedy_prefix_demo)  # Look up next-token probabilities.
    best_index_demo = int(np.argmax(probs_demo))  # Pick the locally most likely token.
    chosen_demo = tokens_demo[best_index_demo]  # Convert the argmax index to a token.
    greedy_logprob_demo += float(np.log(np.clip(probs_demo[best_index_demo], 1e-12, 1.0)))  # Add log probability.
    greedy_prefix_demo.append(chosen_demo)  # Extend the greedy prefix.
    log(f"greedy step {step_demo + 1}", f"choices={tokens_demo.tolist()}, probs={np.round(probs_demo, 3).tolist()}, chose={chosen_demo}")  # Print the local choice.
    if chosen_demo == "<eos>":  # Stop once the end token is generated.
        break  # End greedy decoding.

beam_demo = [(tuple(), 0.0)]  # Start beam search with an empty sequence and log score 0.
beam_width_demo = 2  # Keep the two best partial translations.
for step_demo in range(3):  # Use the same length budget as greedy decoding.
    candidates_demo = []  # Collect one-token extensions from every beam item.
    for prefix_demo, score_demo in beam_demo:  # Expand each surviving partial translation.
        if len(prefix_demo) > 0 and prefix_demo[-1] == "<eos>":  # Preserve completed translations.
            candidates_demo.append((prefix_demo, score_demo))  # Keep completed sequences in the candidate pool.
            continue  # Do not add tokens after EOS.
        tokens_demo, probs_demo = next_options_demo(prefix_demo)  # Get possible next tokens.
        for token_demo, prob_demo in zip(tokens_demo, probs_demo):  # Create one extension per token.
            new_prefix_demo = prefix_demo + (token_demo,)  # Append the candidate token.
            new_score_demo = score_demo + float(np.log(np.clip(prob_demo, 1e-12, 1.0)))  # Add log probability.
            candidates_demo.append((new_prefix_demo, new_score_demo))  # Save the expanded hypothesis.
    beam_demo = sorted(candidates_demo, key=lambda item_demo: item_demo[1], reverse=True)[:beam_width_demo]  # Keep top joint scores.
    log(f"beam step {step_demo + 1}", [(seq_demo, round(score_demo, 3)) for seq_demo, score_demo in beam_demo])  # Print surviving beams.

best_beam_tokens_demo, best_beam_logprob_demo = beam_demo[0]  # Select the best beam hypothesis.
greedy_prob_demo = float(np.exp(greedy_logprob_demo))  # Convert greedy log score back to probability.
beam_prob_demo = float(np.exp(best_beam_logprob_demo))  # Convert beam log score back to probability.
log("greedy output", f"{' '.join(greedy_prefix_demo)} with joint probability {greedy_prob_demo:.4f}")  # Print greedy result.
log("beam output", f"{' '.join(best_beam_tokens_demo)} with joint probability {beam_prob_demo:.4f}")  # Print beam result.

labels_demo = ["greedy\n" + " ".join(greedy_prefix_demo), "beam\n" + " ".join(best_beam_tokens_demo)]  # Label each decoded sentence.
plt.bar(labels_demo, [greedy_prob_demo, beam_prob_demo], color=["slateblue", "darkorange"])  # Compare joint probabilities.
plt.ylabel("joint sequence probability")  # Label the product score.
plt.title("Search compares whole-sentence scores, not just first tokens")  # Explain the plot.
plt.show()  # Render the search comparison.
```
▶ What you'll see: greedy starts with the locally larger first token, while beam keeps an alternate path that ends with a higher whole-sentence probability.

### Step 3 — Attention: turn relevance scores into a context vector

Attention compares a decoder query with source keys, softmaxes the scores into weights, and
returns a weighted sum of value vectors. The weights act like a soft alignment: high weight means
"look here more right now."

```python
query_demo = np.array([1.0, 0.5, 0.0, 0.5])  # Decoder query asking for a source pattern.
keys_demo = np.array([[1.0, 0.4, 0.0, 0.3], [0.1, 0.2, 1.2, 0.1], [0.8, 0.5, 0.0, 0.7]])  # Encoder keys for three source tokens.
values_demo = np.array([[2.0, 0.0], [0.0, 3.0], [1.5, 1.0]])  # Value vectors that carry source information.
source_tokens_demo = np.array(["I", "saw", "cats"])  # Human-readable source labels.
dim_demo = query_demo.size  # Key/query dimension for scaled dot-product attention.
raw_scores_demo = keys_demo @ query_demo  # Compute q·k for every source position.
scaled_scores_demo = raw_scores_demo / np.sqrt(dim_demo)  # Divide by sqrt(d) to avoid overly sharp softmax scores.
shifted_scores_demo = scaled_scores_demo - np.max(scaled_scores_demo)  # Stabilize the softmax by subtracting the max.
attention_weights_demo = np.exp(shifted_scores_demo) / np.exp(shifted_scores_demo).sum()  # Convert scores into weights that sum to one.
context_demo = attention_weights_demo @ values_demo  # Blend value vectors using the attention weights.
log("raw attention scores", np.round(raw_scores_demo, 3))  # Print unscaled relevance scores.
log("scaled attention scores", np.round(scaled_scores_demo, 3))  # Print scaled scores.
log("attention weights", np.round(attention_weights_demo, 3))  # Print soft alignment weights.
log("weights sum", round(float(attention_weights_demo.sum()), 6))  # Verify the weights form a distribution.
log("context vector", np.round(context_demo, 3))  # Print the weighted value summary.

fig_demo, axes_demo = plt.subplots(1, 2, figsize=(9, 3.5))  # Create side-by-side attention visuals.
axes_demo[0].bar(source_tokens_demo, attention_weights_demo, color="teal")  # Draw attention weights as bars.
axes_demo[0].set_ylim(0.0, 1.0)  # Use probability-scale limits.
axes_demo[0].set_ylabel("attention weight")  # Label the bar heights.
axes_demo[0].set_title("Attention over source tokens")  # Title the bar plot.
image_demo = axes_demo[1].imshow(attention_weights_demo.reshape(1, -1), cmap="YlOrRd", vmin=0.0, vmax=1.0, aspect="auto")  # Draw a one-row heatmap.
axes_demo[1].set_xticks(np.arange(len(source_tokens_demo)), source_tokens_demo)  # Label heatmap columns.
axes_demo[1].set_yticks([0], ["query"])  # Label the single decoder row.
axes_demo[1].set_title("Same weights as a heatmap")  # Title the heatmap.
fig_demo.colorbar(image_demo, ax=axes_demo[1], label="weight")  # Add a colorbar for numeric intensity.
plt.tight_layout()  # Prevent labels from overlapping.
plt.show()  # Render both attention visuals.
```
▶ What you'll see: the best-matching source token receives the largest weight, and the context vector becomes a weighted blend of all value vectors.

### Step 4 — BLEU: clipped precision plus a brevity penalty

BLEU rewards candidate translations whose n-grams overlap reference translations, but it clips
repeated matches so the candidate cannot cheat by repeating one good phrase. It also penalizes
outputs that are too short, even when their few words are correct.

```python
candidate_tokens_demo = "the cat sat".split()  # Candidate translation tokens.
reference_tokens_demo = "the cat sat on mat".split()  # Reference translation tokens.
precisions_demo = []  # Store clipped precision for unigram and bigram orders.
for n_demo in [1, 2]:  # Compute BLEU components for 1-grams and 2-grams.
    candidate_grams_demo = [tuple(candidate_tokens_demo[i_demo:i_demo + n_demo]) for i_demo in range(len(candidate_tokens_demo) - n_demo + 1)]  # Candidate n-grams.
    reference_grams_demo = [tuple(reference_tokens_demo[i_demo:i_demo + n_demo]) for i_demo in range(len(reference_tokens_demo) - n_demo + 1)]  # Reference n-grams.
    candidate_counts_demo = {}  # Count candidate n-grams.
    reference_counts_demo = {}  # Count reference n-grams.
    for gram_demo in candidate_grams_demo:  # Visit each candidate n-gram.
        candidate_counts_demo[gram_demo] = candidate_counts_demo.get(gram_demo, 0) + 1  # Increment candidate count.
    for gram_demo in reference_grams_demo:  # Visit each reference n-gram.
        reference_counts_demo[gram_demo] = reference_counts_demo.get(gram_demo, 0) + 1  # Increment reference count.
    clipped_demo = sum(min(count_demo, reference_counts_demo.get(gram_demo, 0)) for gram_demo, count_demo in candidate_counts_demo.items())  # Clip matches by reference counts.
    total_demo = max(1, sum(candidate_counts_demo.values()))  # Count candidate n-grams safely.
    precision_demo = clipped_demo / total_demo  # Compute modified n-gram precision.
    precisions_demo.append(max(precision_demo, 1e-12))  # Store a log-safe precision.
    log(f"{n_demo}-gram clipped precision", f"{clipped_demo}/{total_demo} = {precision_demo:.3f}")  # Print BLEU arithmetic.

candidate_len_demo = len(candidate_tokens_demo)  # Candidate length c.
reference_len_demo = len(reference_tokens_demo)  # Reference length r.
brevity_penalty_demo = 1.0 if candidate_len_demo > reference_len_demo else float(np.exp(1.0 - reference_len_demo / max(candidate_len_demo, 1)))  # Penalize too-short candidates.
precision_mean_demo = float(np.exp(np.mean(np.log(np.array(precisions_demo)))))  # Geometric mean of clipped precisions.
bleu_demo = brevity_penalty_demo * precision_mean_demo  # Final BLEU = BP times geometric precision.
log("candidate", candidate_tokens_demo)  # Print candidate tokens.
log("reference", reference_tokens_demo)  # Print reference tokens.
log("brevity penalty", round(brevity_penalty_demo, 3))  # Print length penalty.
log("BLEU", round(bleu_demo, 3))  # Print final BLEU score.

component_labels_demo = ["p1", "p2", "BP", "BLEU"]  # Name BLEU components.
component_values_demo = [precisions_demo[0], precisions_demo[1], brevity_penalty_demo, bleu_demo]  # Collect component values.
plt.bar(component_labels_demo, component_values_demo, color=["steelblue", "steelblue", "gray", "purple"])  # Plot precision, penalty, and final score.
plt.ylim(0.0, 1.05)  # BLEU components are naturally between 0 and 1 here.
plt.ylabel("score")  # Label the score axis.
plt.title("BLEU: high n-gram precision can still be shortened by BP")  # Explain the plot.
plt.show()  # Render the BLEU component chart.
```
▶ What you'll see: the candidate matches the reference prefix well, but BLEU falls below 1 because the candidate stops too early.

### Recap — what you just ran

- A **language model** multiplied next-token probabilities, and **perplexity** summarized average surprise.
- **Greedy decoding** made local choices, while **beam search** kept multiple partial translations and found a better joint score.
- **Attention** converted query-key scores into soft alignment weights and a context vector.
- **BLEU** combined clipped n-gram precision with a brevity penalty for short outputs.

Everything below (starting at **§1 Overview**) develops these same ideas with full derivations,
more examples, and a larger hands-on notebook section.

---

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


### 📖 Concept walkthrough — build each idea from scratch

Before the warm-up examples, we build each language-modeling and translation idea from scratch, one small step at a time. Each concept explains *what* we compute, *why* the idea matters, and *why* the code uses this tiny construction. Everything here uses only NumPy + Matplotlib and tiny inline data, so every probability, search score, attention weight, and BLEU component is inspectable. Variables carry a `_w` suffix so they never collide with the examples below.

```python
import numpy as np  # use NumPy for probability tables, vector math, stable softmax, and reproducible arrays.
import matplotlib.pyplot as plt  # use Matplotlib so every concept has a direct visual check.
np.random.seed(230)  # seed randomness so any later randomized variation stays reproducible.
```

#### 1. Language models and perplexity: multiply local predictions, then normalize surprise

A language model assigns a sequence probability by multiplying next-token conditionals. For a bigram model, the history is just the previous token:

$$
P(y)=\prod_{t=1}^{T}P(y^{<t>}\mid y^{<t-1>}).
$$

Perplexity rewrites the average negative log-likelihood on an exponential scale:

$$
\operatorname{PP}=\exp\left(-\frac{1}{T}\sum_{t=1}^{T}\log p_t\right).
$$

We build a tiny probability table because it makes the product, logs, and final comparison visible. The exponential turns average log surprise back into a per-word branching factor: a perplexity of 2 means the model is about as uncertain as choosing among two equally plausible next words at each step.

```python
contexts_w = np.array(["<s>", "i", "like", "cats"])  # list the previous-token contexts needed for one sentence.
choices_w = np.array(["i", "like", "cats", "dogs", "<eos>"])  # list a tiny next-token vocabulary.
good_bigram_w = np.array([[0.72, 0.10, 0.06, 0.04, 0.08], [0.06, 0.70, 0.08, 0.06, 0.10], [0.05, 0.08, 0.68, 0.14, 0.05], [0.04, 0.04, 0.06, 0.06, 0.80]])  # store a model that likes "i like cats".
weak_bigram_w = np.array([[0.30, 0.22, 0.16, 0.14, 0.18], [0.18, 0.28, 0.20, 0.16, 0.18], [0.14, 0.18, 0.30, 0.24, 0.14], [0.16, 0.15, 0.18, 0.15, 0.36]])  # store a less confident model for the same path.
target_next_w = np.array(["i", "like", "cats", "<eos>"])  # define the actual next token at each step.
target_cols_w = np.array([np.where(choices_w == token_w)[0][0] for token_w in target_next_w])  # convert target tokens to column indices.
print("contexts:", contexts_w)  # inspect the conditional rows used to score the sentence.
print("target next tokens:", target_next_w)  # inspect the correct next token for each row.
print("good model table rows sum to:", np.round(good_bigram_w.sum(axis=1), 3))  # verify each row is a probability distribution.
```

```python
good_path_probs_w = good_bigram_w[np.arange(len(contexts_w)), target_cols_w]  # select P(correct next token | previous token) from the good table.
weak_path_probs_w = weak_bigram_w[np.arange(len(contexts_w)), target_cols_w]  # select the same conditionals from the weaker table.
good_sentence_prob_w = np.prod(good_path_probs_w)  # multiply conditionals to get the sentence probability under the good model.
weak_sentence_prob_w = np.prod(weak_path_probs_w)  # multiply conditionals to get the sentence probability under the weak model.
good_ppl_w = np.exp(-np.mean(np.log(np.clip(good_path_probs_w, 1e-12, 1.0))))  # compute perplexity with a log-zero guard.
weak_ppl_w = np.exp(-np.mean(np.log(np.clip(weak_path_probs_w, 1e-12, 1.0))))  # compute the weak model perplexity with the same formula.
print("good conditionals:", np.round(good_path_probs_w, 3))  # show each local probability in the product.
print("weak conditionals:", np.round(weak_path_probs_w, 3))  # show each local probability in the weaker product.
print("sentence probabilities:", np.round([good_sentence_prob_w, weak_sentence_prob_w], 5))  # compare full sequence probabilities.
print("perplexities:", np.round([good_ppl_w, weak_ppl_w], 3))  # confirm lower perplexity belongs to the better model.
```

```python
plt.figure(figsize=(6.8, 4.0))  # create one compact comparison figure.
plt.bar(["good model", "weak model"], [good_ppl_w, weak_ppl_w], color=["seagreen", "tomato"], alpha=0.85)  # plot perplexity so lower is visibly better.
plt.title("1: Language model perplexity comparison")  # title the figure with the subsection number.
plt.ylabel("perplexity = exp(mean negative log p)")  # label the vertical axis with the exact quantity.
plt.ylim(0.0, max(good_ppl_w, weak_ppl_w) * 1.25)  # leave visual headroom above the taller bar.
plt.show()  # render the perplexity plot.
```

▶ What you'll see: the model with larger correct-token probabilities gives a much larger sentence probability and a lower perplexity bar.

*Why it's done this way: multiplying conditionals shows how local next-word predictions define a full sentence probability, while averaging logs before exponentiating makes sequences of different lengths comparable.*

#### 2. Machine translation and search: greedy choices versus beam joint scoring

A translation decoder must search over output sequences, not just choose one token. Greedy decoding takes the local argmax at every step, while beam search keeps the top-$k$ partial sequences by summed log probability:

$$
\operatorname{score}(y\mid x)=\sum_t \log P(y^{<t>}\mid x,y^{<1:t-1>}).
$$

We use a hand-built decoder table where the first locally best token leads to a mediocre ending, while the second-best start leads to a stronger whole sentence. This shows why beam search trades extra compute for a better joint score.

```python
def step_probs_w(prefix_w):  # define a tiny prefix-conditioned translation model.
    table_w = {(): (["le", "la"], [0.60, 0.40]), ("le",): (["chat", "chien"], [0.45, 0.55]), ("la",): (["chatte", "maison"], [0.90, 0.10]), ("le", "chien"): (["<eos>"], [0.50]), ("le", "chat"): (["<eos>"], [0.45]), ("la", "chatte"): (["<eos>"], [0.95]), ("la", "maison"): (["<eos>"], [0.30])}  # store tiny token probabilities by prefix.
    tokens_w, probs_w = table_w.get(tuple(prefix_w), (["<eos>"], [1.0]))  # return EOS for unknown prefixes.
    return np.array(tokens_w), np.array(probs_w, dtype=float)  # return arrays for vectorized scoring.
prefix_w = []  # start decoding with an empty target prefix.
greedy_tokens_w = []  # keep the greedy output tokens.
greedy_logprob_w = 0.0  # accumulate the greedy log score.
for step_w in range(3):  # decode at most three steps in this tiny example.
    tokens_w, probs_w = step_probs_w(prefix_w)  # get next-token probabilities for the current prefix.
    best_index_w = int(np.argmax(probs_w))  # choose the locally highest-probability token.
    chosen_w = tokens_w[best_index_w]  # map the best index back to a token.
    greedy_logprob_w += float(np.log(np.clip(probs_w[best_index_w], 1e-12, 1.0)))  # add the chosen token log probability.
    greedy_tokens_w.append(chosen_w)  # append the chosen token to the output.
    prefix_w.append(chosen_w)  # condition the next step on the chosen token.
    print("greedy step", step_w + 1, "tokens", tokens_w, "probs", probs_w, "chosen", chosen_w, "log score", round(greedy_logprob_w, 3))  # inspect the local decision.
    if chosen_w == "<eos>":  # stop if the decoder emits EOS.
        break  # end greedy decoding.
print("greedy output:", greedy_tokens_w, "joint probability", round(float(np.exp(greedy_logprob_w)), 4))  # show the final greedy score.
```

```python
beam_w = [(tuple(), 0.0)]  # initialize beam search with an empty sequence and log score zero.
beam_width_w = 2  # keep the two best partial translations after each expansion.
history_w = []  # store beam states for plotting and inspection.
for step_w in range(3):  # run the same three-step budget as greedy decoding.
    candidates_w = []  # collect every one-token extension of every beam item.
    for prefix_w, score_w in beam_w:  # expand each current beam sequence.
        tokens_w, probs_w = step_probs_w(prefix_w)  # get next-token probabilities for this prefix.
        for token_w, prob_w in zip(tokens_w, probs_w):  # create one candidate per possible next token.
            candidates_w.append((prefix_w + (token_w,), score_w + float(np.log(np.clip(prob_w, 1e-12, 1.0)))))  # add log probability to the prefix score.
    beam_w = sorted(candidates_w, key=lambda item_w: item_w[1], reverse=True)[:beam_width_w]  # keep the top-k joint log scores.
    history_w.append(beam_w)  # save this step's surviving beam.
    print("beam step", step_w + 1, [(seq_w, round(score_w, 3)) for seq_w, score_w in beam_w])  # inspect surviving partial translations.
best_beam_tokens_w, best_beam_logprob_w = beam_w[0]  # take the highest-scoring final beam sequence.
print("beam output:", best_beam_tokens_w, "joint probability", round(float(np.exp(best_beam_logprob_w)), 4))  # show the final beam score.
```

```python
plt.figure(figsize=(7.0, 4.0))  # create a compact comparison plot for search outcomes.
search_labels_w = ["greedy\\n" + " ".join(greedy_tokens_w), "beam\\n" + " ".join(best_beam_tokens_w)]  # label bars with decoded sequences.
search_probs_w = [float(np.exp(greedy_logprob_w)), float(np.exp(best_beam_logprob_w))]  # convert log scores back to joint probabilities.
plt.bar(search_labels_w, search_probs_w, color=["slateblue", "darkorange"], alpha=0.85)  # plot the joint scores found by each search method.
plt.title("2: Greedy versus beam search joint score")  # title the figure with the subsection number.
plt.ylabel("joint sequence probability")  # label the vertical axis as the product of token probabilities.
plt.ylim(0.0, max(search_probs_w) * 1.25)  # add headroom above the better sequence.
plt.show()  # render the search comparison.
```

▶ What you'll see: greedy starts with the locally larger first token, but beam keeps the runner-up and finds a higher-probability complete sequence.

*Why it's done this way: log scores turn products into sums, making partial translations easy to compare; keeping $k>1$ hypotheses costs more computation but reduces the chance that an early local choice ruins the whole sentence.*

#### 3. Attention: score positions, softmax weights, and a context vector

Attention lets a decoder query choose which source positions matter right now. Scaled dot-product attention computes

$$
\operatorname{scores}=\frac{qK^\top}{\sqrt{d}},\qquad
\alpha=\operatorname{softmax}(\operatorname{scores}),\qquad
c=\sum_i \alpha_i v_i.
$$

We build one query, three keys, and three values so the compatibility scores, weights, and final context vector can all be inspected. Dividing by $\sqrt{d}$ keeps dot products from growing too large in high dimensions, which keeps the softmax from saturating into almost-one-hot weights too early.

```python
query_w = np.array([1.0, 0.5, 0.0, 0.5])  # define one decoder query that asks for a source pattern.
keys_w = np.array([[1.0, 0.4, 0.0, 0.3], [0.1, 0.2, 1.2, 0.1], [0.8, 0.5, 0.0, 0.7]])  # define three source-position keys.
values_w = np.array([[2.0, 0.0], [0.0, 3.0], [1.5, 1.0]])  # define values that carry information to mix into context.
source_labels_w = np.array(["I", "saw", "cats"])  # name the source positions for readable plots.
dim_w = query_w.shape[0]  # measure the key/query dimensionality for scaling.
raw_scores_w = keys_w @ query_w  # compute unscaled dot-product compatibility scores.
scaled_scores_w = raw_scores_w / np.sqrt(dim_w)  # apply the scaled dot-product attention factor.
print("raw scores:", np.round(raw_scores_w, 3))  # inspect unscaled query-key matches.
print("scaled scores:", np.round(scaled_scores_w, 3))  # inspect scores after dividing by sqrt(d).
```

```python
shifted_scores_w = scaled_scores_w - np.max(scaled_scores_w)  # subtract the max for a stable softmax.
exp_scores_w = np.exp(shifted_scores_w)  # exponentiate shifted scores into positive weights.
attention_weights_w = exp_scores_w / exp_scores_w.sum()  # normalize weights so they sum to one.
context_w = attention_weights_w @ values_w  # compute the weighted sum of value vectors.
print("attention weights:", np.round(attention_weights_w, 3))  # show how focus is distributed over source positions.
print("weights sum:", round(float(attention_weights_w.sum()), 6))  # verify the softmax distribution sums to one.
print("context vector:", np.round(context_w, 3))  # inspect the information passed to the decoder.
```

```python
plt.figure(figsize=(6.8, 3.8))  # create a compact attention-weight figure.
plt.bar(source_labels_w, attention_weights_w, color="teal", alpha=0.85)  # plot attention weights for each source position.
plt.title("3: Attention weights over source positions")  # title the figure with the subsection number.
plt.ylabel("attention weight")  # label the vertical axis as normalized focus.
plt.ylim(0.0, 1.0)  # use the probability range so weights are immediately interpretable.
plt.show()  # render the bar plot.
```

```python
plt.figure(figsize=(5.6, 2.2))  # create a small heatmap-style figure.
plt.imshow(attention_weights_w.reshape(1, -1), cmap="YlOrRd", aspect="auto", vmin=0.0, vmax=1.0)  # draw the same weights as a one-row attention map.
plt.xticks(np.arange(len(source_labels_w)), source_labels_w)  # label source positions along the x-axis.
plt.yticks([0], ["query"])  # label the single decoder query row.
plt.colorbar(label="weight")  # add a colorbar so color intensity has numeric meaning.
plt.title("3: Attention heatmap")  # title the heatmap with the subsection number.
plt.show()  # render the heatmap.
```

▶ What you'll see: the source position whose key best matches the query receives the largest weight, and the context vector becomes a weighted blend of value vectors.

*Why it's done this way: dot products measure relevance, the stable softmax turns relevance into a probability distribution, and the weighted sum lets the model focus on useful positions without discarding the others completely.*

#### 4. BLEU: clipped n-gram precision plus a penalty for being too short

BLEU compares a candidate translation against reference translations using modified precision. For each n-gram order, repeated candidate n-grams are clipped by how often they appear in the references:

$$
p_n=\frac{\sum_g \min(\operatorname{count}_{cand}(g),\operatorname{count}_{ref}(g))}{\sum_g \operatorname{count}_{cand}(g)}.
$$

The geometric mean of precisions is multiplied by a brevity penalty, so a candidate that says only one perfect word cannot game precision by being short:

$$
BP=\begin{cases}1,&c>r\\ \exp(1-r/c),&c\le r\end{cases}.
$$

We compute unigram and bigram BLEU by hand to expose the clipping and the length penalty.

```python
def ngrams_w(tokens_w, n_w):  # define a tiny contiguous n-gram extractor.
    return [tuple(tokens_w[i_w:i_w + n_w]) for i_w in range(len(tokens_w) - n_w + 1)]  # slide a window of width n over tokens.
def count_ngrams_w(tokens_w, n_w):  # define a count table without importing Counter.
    counts_w = {}  # start an empty dictionary of n-gram counts.
    for gram_w in ngrams_w(tokens_w, n_w):  # iterate through every extracted n-gram.
        counts_w[gram_w] = counts_w.get(gram_w, 0) + 1  # increment this n-gram's count.
    return counts_w  # return the completed count dictionary.
candidate_w = "the cat sat".split()  # choose a candidate that is shorter than the reference.
reference_w = "the cat sat on mat".split()  # choose one reference translation.
print("candidate tokens:", candidate_w)  # inspect candidate tokens.
print("reference tokens:", reference_w)  # inspect reference tokens.
```

```python
precisions_w = []  # store modified precision for each n-gram order.
bleu_details_w = []  # store readable numerator and denominator details.
for n_w in [1, 2]:  # compute unigram and bigram modified precision.
    cand_counts_w = count_ngrams_w(candidate_w, n_w)  # count candidate n-grams.
    ref_counts_w = count_ngrams_w(reference_w, n_w)  # count reference n-grams.
    clipped_total_w = 0  # accumulate clipped matches.
    cand_total_w = max(1, sum(cand_counts_w.values()))  # count candidate n-grams while avoiding division by zero.
    for gram_w, cand_count_w in cand_counts_w.items():  # inspect each candidate n-gram.
        clipped_total_w += min(cand_count_w, ref_counts_w.get(gram_w, 0))  # add the reference-clipped match count.
    precision_w = clipped_total_w / cand_total_w  # compute modified n-gram precision.
    precisions_w.append(max(precision_w, 1e-12))  # store a log-safe precision.
    bleu_details_w.append((n_w, clipped_total_w, cand_total_w, precision_w))  # keep details for printing.
    print("n=", n_w, "clipped/total=", clipped_total_w, "/", cand_total_w, "precision=", round(precision_w, 3))  # show the precision arithmetic.
```

```python
cand_len_w = len(candidate_w)  # compute candidate length c.
ref_len_w = len(reference_w)  # compute reference length r.
brevity_penalty_w = 1.0 if cand_len_w > ref_len_w else float(np.exp(1.0 - ref_len_w / max(cand_len_w, 1)))  # apply BLEU's brevity penalty.
bleu_w = brevity_penalty_w * float(np.exp(np.mean(np.log(np.array(precisions_w)))))  # combine precisions geometrically and multiply by BP.
no_bp_bleu_w = float(np.exp(np.mean(np.log(np.array(precisions_w)))))  # compute the score without BP for comparison.
print("brevity penalty:", round(brevity_penalty_w, 3))  # show how much the short candidate is penalized.
print("BLEU without BP:", round(no_bp_bleu_w, 3))  # show the score if length were ignored.
print("BLEU with BP:", round(bleu_w, 3))  # show the final BLEU score.
```

```python
plt.figure(figsize=(7.0, 4.0))  # create a compact BLEU component plot.
bleu_labels_w = ["p1", "p2", "BP", "BLEU"]  # name the plotted BLEU components.
bleu_values_w = [precisions_w[0], precisions_w[1], brevity_penalty_w, bleu_w]  # collect precision, penalty, and final score.
plt.bar(bleu_labels_w, bleu_values_w, color=["steelblue", "steelblue", "gray", "purple"], alpha=0.85)  # plot each component side by side.
plt.title("4: BLEU components with brevity penalty")  # title the figure with the subsection number.
plt.ylabel("score")  # label the vertical axis as a bounded score.
plt.ylim(0.0, 1.05)  # use the natural BLEU component range.
plt.show()  # render the BLEU component plot.
```

▶ What you'll see: the n-gram precisions are high because the candidate words match the reference prefix, but the brevity penalty lowers the final BLEU score because the candidate stops early.

*Why it's done this way: clipped precision prevents repeated lucky phrases from getting too much credit, and the brevity penalty prevents very short translations from winning by predicting only safe words.*

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
