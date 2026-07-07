# RNN Fundamentals & LSTM/GRU
> **Source:** CS 230 · **Category:** Model · **Type:** ⚖️ Both · [↑ Full reference](../../ai-ml-cheatsheets.md)
> 📓 The coded examples form a runnable notebook section; an .ipynb will be generated.

## 1. Overview

Recurrent neural networks process ordered data by reusing one learned update rule across timesteps. The hidden state is a running summary: it lets a model decide today using information it saw yesterday, ten tokens ago, or at the start of a sequence.

Vanilla RNNs are simple and useful for short dependencies, but their gradients multiply many recurrent Jacobians, so old signals often vanish or explode. GRUs and LSTMs add gates that learn what to keep, erase, update, reset, and reveal, making longer-range memory practical.

**One-line intuition:** a vanilla RNN is a reusable memory update; a GRU/LSTM is that update with learned valves controlling information flow.

## 2. Key Idea

For a sequence $x^{<1>},\ldots,x^{<T>}$, the vanilla RNN update is

$$
\boxed{a^{<t>}=\tanh\left(W_{aa}a^{<t-1>}+W_{ax}x^{<t>}+b_a\right)}.
$$

The CS 230 reference writes the general cell and output as

$$
\boxed{a^{<t>}=g_1\left(W_{aa}a^{<t-1>}+W_{ax}x^{<t>}+b_a\right)},
\qquad
\boxed{y^{<t>}=g_2\left(W_{ya}a^{<t>}+b_y\right)}.
$$

The same $W_{aa},W_{ax},W_{ya},b_a,b_y$ are shared at all timesteps. For sequence labeling, the total loss is

$$
\boxed{\mathcal L(\widehat y,y)=\sum_{t=1}^{T_y}\mathcal L\left(\widehat y^{<t>},y^{<t>}\right)}.
$$

Backpropagation through time accumulates the effect of every unrolled copy of a shared parameter:

$$
\boxed{\frac{\partial \mathcal L^{(T)}}{\partial W}=\sum_{t=1}^{T}\left.\frac{\partial \mathcal L^{(T)}}{\partial W}\right|_{(t)}}.
$$

A gate has the universal form

$$
\boxed{\Gamma=\sigma\left(Wx^{<t>}+Ua^{<t-1>}+b\right)},
\qquad
\sigma(z)=\frac{1}{1+e^{-z}}.
$$

| Gate | Role | Used in |
|---|---|---|
| Update gate $\Gamma_u$ | How much new candidate information should enter memory? | GRU, LSTM |
| Relevance/reset gate $\Gamma_r$ | How much previous activation should affect the candidate? | GRU, LSTM |
| Forget gate $\Gamma_f$ | How much old cell memory should remain? | LSTM |
| Output gate $\Gamma_o$ | How much internal memory should be exposed? | LSTM |

The GRU equations are

$$
\Gamma_u=\sigma(W_ux^{<t>}+U_ua^{<t-1>}+b_u),
\qquad
\Gamma_r=\sigma(W_rx^{<t>}+U_ra^{<t-1>}+b_r),
$$

$$
\boxed{\widetilde c^{<t>}=\tanh\left(W_c[\Gamma_r*a^{<t-1>},x^{<t>}]+b_c\right)},
$$

$$
\boxed{c^{<t>}=\Gamma_u*\widetilde c^{<t>}+(1-\Gamma_u)*c^{<t-1>}},
\qquad
\boxed{a^{<t>}=c^{<t>}}.
$$

The LSTM equations are

$$
\Gamma_f=\sigma(W_fx^{<t>}+U_fa^{<t-1>}+b_f),\quad
\Gamma_u=\sigma(W_ux^{<t>}+U_ua^{<t-1>}+b_u),
$$

$$
\Gamma_r=\sigma(W_rx^{<t>}+U_ra^{<t-1>}+b_r),\quad
\Gamma_o=\sigma(W_ox^{<t>}+U_oa^{<t-1>}+b_o),
$$

$$
\boxed{\widetilde c^{<t>}=\tanh\left(W_c[\Gamma_r*a^{<t-1>},x^{<t>}]+b_c\right)},
$$

$$
\boxed{c^{<t>}=\Gamma_u*\widetilde c^{<t>}+\Gamma_f*c^{<t-1>}},
\qquad
\boxed{a^{<t>}=\Gamma_o*c^{<t>}}.
$$

For a scalar vanilla RNN,

$$
\frac{\partial a^{<t>}}{\partial a^{<t-1>}}=\left(1-(a^{<t>})^2\right)w_{aa}.
$$

Thus a long gradient contains a product:

$$
\boxed{\frac{\partial a^{<T>}}{\partial a^{<k>}}=\prod_{t=k+1}^{T}\left(1-(a^{<t>})^2\right)w_{aa}}.
$$

If the typical factor has magnitude $\rho<1$, the product behaves like $\rho^{T-k}$ and vanishes; if $\rho>1$, it explodes. Clipping controls exploding gradients by

$$
\boxed{g_{\text{clipped}}=\begin{cases}g,&\lVert g\rVert_2\le C,\\ Cg/\lVert g\rVert_2,&\lVert g\rVert_2>C.\end{cases}}
$$

LSTM-style additive cell paths help long memory because $c^{<t>}=\Gamma_u\widetilde c^{<t>}+\Gamma_fc^{<t-1>}$ can keep $c^{<t-1>}$ almost unchanged when $\Gamma_f\approx1$.

## 3. Worked Examples

### Setup

```python
import numpy as np  # Import NumPy for arrays, linear algebra, and deterministic synthetic data.
import matplotlib.pyplot as plt  # Import Matplotlib for all lesson visualizations.

np.random.seed(23)  # Seed NumPy so all random examples are reproducible.

plt.rcParams["figure.figsize"] = (8, 4)  # Use consistent figure sizing for notebook readability.
plt.rcParams["axes.grid"] = True  # Add grids so trends and thresholds are easy to see.
plt.rcParams["font.size"] = 11  # Set a readable font size for axes and legends.


def sigmoid(z):  # Define the sigmoid used for gates and binary outputs.
    z = np.asarray(z)  # Convert scalars or lists into arrays for uniform handling.
    return 1.0 / (1.0 + np.exp(-np.clip(z, -60.0, 60.0)))  # Clip logits to avoid numerical overflow.


def tanh(z):  # Define a tanh wrapper matching the mathematical notation.
    return np.tanh(z)  # Call NumPy's stable hyperbolic tangent.


def bce(y_true, y_prob):  # Define binary cross-entropy for toy classifiers.
    eps = 1e-9  # Choose a tiny value to avoid log zero.
    y_prob = np.clip(y_prob, eps, 1.0 - eps)  # Keep probabilities strictly inside (0, 1).
    return -(y_true * np.log(y_prob) + (1.0 - y_true) * np.log(1.0 - y_prob))  # Return elementwise BCE.


def softmax(logits):  # Define a stable softmax for character generation.
    shifted = logits - np.max(logits)  # Subtract the maximum logit for numerical stability.
    exp_values = np.exp(shifted)  # Exponentiate shifted logits.
    return exp_values / np.sum(exp_values)  # Normalize exponentials into probabilities.
```

#### Data — swappable sources

```python
DATA_SOURCE = "copy"  # Options used below include "copy", "parity", "sentiment", "characters", and "tagging".


def make_copy_data(n_samples=120, seq_len=30):  # Create delayed-copy examples that stress long memory.
    X = np.zeros((n_samples, seq_len, 1))  # Allocate scalar input sequences.
    y = np.zeros(n_samples)  # Allocate one binary target per sequence.
    for i in range(n_samples):  # Fill each sequence independently.
        bit = np.random.randint(0, 2)  # Sample the bit that must be remembered.
        X[i, 0, 0] = bit  # Put the important bit at the first timestep.
        X[i, -1, 0] = 1.0  # Put a marker at the final timestep.
        y[i] = bit  # Make the label equal to the first bit.
    return X, y  # Return inputs and targets.


def make_parity_data(n_samples=120, seq_len=12):  # Create parity examples for sequence classification.
    X = np.random.randint(0, 2, size=(n_samples, seq_len, 1)).astype(float)  # Draw binary sequences.
    y = (X.sum(axis=(1, 2)) % 2).astype(float)  # Label odd sums as one and even sums as zero.
    return X, y  # Return inputs and parity labels.


def make_sentiment_data():  # Create a tiny offline sentiment corpus.
    sentences = ["good clear useful", "great helpful", "love simple", "bad confusing", "terrible slow", "broken unclear", "good but slow", "bad but helpful"]  # Store short labeled phrases.
    labels = np.array([1, 1, 1, 0, 0, 0, 1, 0], dtype=float)  # Encode positive as one and negative as zero.
    vocab = sorted({word for sentence in sentences for word in sentence.split()})  # Build a sorted vocabulary.
    word_to_id = {word: idx for idx, word in enumerate(vocab)}  # Map each word to a stable index.
    max_len = max(len(sentence.split()) for sentence in sentences)  # Compute the padded sequence length.
    X = np.zeros((len(sentences), max_len, len(vocab)))  # Allocate one-hot token sequences.
    for i, sentence in enumerate(sentences):  # Convert every sentence to one-hot rows.
        for t, word in enumerate(sentence.split()):  # Visit words in order.
            X[i, t, word_to_id[word]] = 1.0  # Mark the active word coordinate.
    return X, labels, vocab, sentences  # Return arrays and metadata.


def make_character_data(text="hello recurrent neural networks learn letters ", seq_len=8):  # Create next-character windows.
    chars = sorted(set(text))  # Build the character vocabulary.
    char_to_id = {ch: idx for idx, ch in enumerate(chars)}  # Map characters to integer ids.
    X = []  # Prepare a list of encoded windows.
    y = []  # Prepare a list of next-character labels.
    for start in range(len(text) - seq_len):  # Slide a fixed window through text.
        window = text[start:start + seq_len]  # Extract an input window.
        target = text[start + seq_len]  # Extract the next character after the window.
        encoded = np.zeros((seq_len, len(chars)))  # Allocate one-hot rows for the window.
        for t, ch in enumerate(window):  # Encode each character in the window.
            encoded[t, char_to_id[ch]] = 1.0  # Mark the character coordinate.
        X.append(encoded)  # Save the encoded input.
        y.append(char_to_id[target])  # Save the next-character id.
    return np.array(X), np.array(y), chars, char_to_id  # Return arrays and vocabulary.


def make_tagging_data():  # Create a toy tagging corpus where future context helps.
    sentences = [["bank", "approves", "loan"], ["river", "bank", "floods"], ["apple", "releases", "phone"], ["green", "apple", "falls"]]  # Store token sequences.
    labels = [["ORG", "OTHER", "OTHER"], ["OTHER", "PLACE", "OTHER"], ["ORG", "OTHER", "OTHER"], ["OTHER", "FRUIT", "OTHER"]]  # Store token labels.
    vocab = sorted({token for sentence in sentences for token in sentence})  # Build token vocabulary.
    tagset = sorted({tag for row in labels for tag in row})  # Build tag vocabulary.
    token_to_id = {token: idx for idx, token in enumerate(vocab)}  # Map tokens to indices.
    tag_to_id = {tag: idx for idx, tag in enumerate(tagset)}  # Map tags to indices.
    X = np.zeros((len(sentences), 3, len(vocab)))  # Allocate one-hot token arrays.
    Y = np.zeros((len(sentences), 3), dtype=int)  # Allocate integer tag labels.
    for i, sentence in enumerate(sentences):  # Encode each sentence.
        for t, token in enumerate(sentence):  # Encode each token position.
            X[i, t, token_to_id[token]] = 1.0  # Set token one-hot coordinate.
            Y[i, t] = tag_to_id[labels[i][t]]  # Store the tag id.
    return X, Y, vocab, tagset, sentences, labels  # Return data and metadata.

copy_X, copy_y = make_copy_data()  # Materialize delayed-copy data.
parity_X, parity_y = make_parity_data()  # Materialize parity data.
sent_X, sent_y, sent_vocab, sent_sentences = make_sentiment_data()  # Materialize sentiment data.
char_X, char_y, char_vocab, char_to_id = make_character_data()  # Materialize character data.
tag_X, tag_Y, tag_vocab, tagset, tag_sentences, tag_labels = make_tagging_data()  # Materialize tagging data.

print("copy", copy_X.shape, copy_y.shape)  # Show delayed-copy dimensions.
print("parity", parity_X.shape, parity_y.shape)  # Show parity dimensions.
print("sentiment", sent_X.shape, sent_vocab)  # Show sentiment dimensions and vocabulary.
print("characters", char_X.shape, char_vocab)  # Show character dimensions and vocabulary.
print("tagging", tag_X.shape, tagset)  # Show tagging dimensions and tag set.
```

▶ What you'll see: all datasets are small CPU-friendly arrays. The delayed-copy source intentionally stresses a vanilla RNN because the decisive bit appears at the first timestep but is predicted at the final timestep.

👀 Every input has shape `(examples, timesteps, features)`.



### 📖 Concept walkthrough — build each idea from scratch

Before the warm-up examples, we build the recurrent-network ideas from scratch, one small step at a time. Everything here uses only NumPy + Matplotlib and tiny inline data, so every hidden state, gate value, cell update, and blend is inspectable. Variables carry a `_w` suffix so they never collide with the examples below.

```python
import numpy as np  # NumPy gives us arrays, matrix products, and stable elementwise math for RNN cells.
import matplotlib.pyplot as plt  # Matplotlib lets us see hidden states, gate curves, and memory blends visually.
np.random.seed(23)  # Fix the seed so every printed value and plot is reproducible across notebook runs.
```

#### 1. Vanilla RNN hidden-state recurrence: one tanh memory update

A vanilla RNN keeps a hidden vector $h_t$ by mixing the current input $x_t$ with the previous hidden state $h_{t-1}$. The basic update is

$$
h_t=\tanh(W_xx_t+W_hh_{t-1}+b).
$$

We build one tiny step by hand because the recurrence is the main idea: $W_hh_{t-1}$ carries information forward, while $W_xx_t$ lets the new input revise that memory. The $\tanh$ nonlinearity keeps each hidden coordinate bounded between $-1$ and $1$.

```python
x_step_w = np.array([0.7, -0.2])  # Store one small input vector x_t with two features.
h_prev_w = np.array([0.3, -0.4, 0.1])  # Store the previous hidden state h_{t-1} with three memory coordinates.
W_x_step_w = np.array([[0.5, -0.1], [-0.3, 0.8], [0.2, 0.4]])  # Map the 2-D input into the 3-D hidden space.
W_h_step_w = np.array([[0.4, 0.1, -0.2], [0.0, 0.5, 0.3], [-0.1, 0.2, 0.6]])  # Reuse old hidden information through recurrent weights.
b_step_w = np.array([0.05, -0.02, 0.03])  # Add one bias per hidden coordinate.
print("x_t:", x_step_w)  # Inspect the current input.
print("h_{t-1}:", h_prev_w)  # Inspect the memory entering this step.
```
▶ What you'll see: a tiny input vector and the previous hidden state that the RNN will combine.

```python
input_part_w = W_x_step_w @ x_step_w  # Compute W_x x_t, the contribution from the current input.
recurrent_part_w = W_h_step_w @ h_prev_w  # Compute W_h h_{t-1}, the carried-forward memory contribution.
preact_step_w = input_part_w + recurrent_part_w + b_step_w  # Add input, recurrence, and bias before tanh.
h_step_w = np.tanh(preact_step_w)  # Apply tanh to produce the new bounded hidden state h_t.
print("W_x x_t:", np.round(input_part_w, 3))  # Show how the input pushes each hidden coordinate.
print("W_h h_{t-1}:", np.round(recurrent_part_w, 3))  # Show how the old memory pushes each coordinate.
print("pre-activation:", np.round(preact_step_w, 3))  # Show the value before the nonlinearity.
print("h_t:", np.round(h_step_w, 3))  # Show the final hidden state after tanh.
```
The recurrence is useful because $h_t$ is not computed from $x_t$ alone; it also depends on $h_{t-1}$, which already summarized earlier inputs. That repeated dependence is how sequence information moves forward.
▶ What you'll see: the input contribution, recurrent contribution, pre-activation, and final $\tanh$ hidden vector.

```python
plt.figure(figsize=(5.5, 3.4))  # Create a compact bar chart for the new hidden vector.
plt.bar(np.arange(len(h_step_w)), h_step_w, color="tab:purple")  # Draw one bar per hidden coordinate.
plt.axhline(0.0, color="black", linewidth=1.0)  # Mark zero so positive and negative memory are easy to distinguish.
plt.ylim(-1.0, 1.0)  # Use tanh's natural output range as the vertical scale.
plt.xlabel("hidden coordinate")  # Label the coordinate index.
plt.ylabel("h_t value")  # Label the hidden-state value.
plt.title("1: vanilla RNN one-step hidden state")  # Title the subsection figure.
plt.show()  # Render the bar chart.
```
▶ What you'll see: the three coordinates of the new hidden state, all bounded inside $[-1,1]$.

*Why it's done this way: a vanilla RNN reuses one small learned update at every timestep, so the model can carry a compact summary forward instead of storing every past input separately.*

#### 2. Unrolling through time: one update reused across a sequence

Unrolling means writing the same RNN cell once per timestep: $h_1$ feeds $h_2$, $h_2$ feeds $h_3$, and so on. The important part is weight sharing: every copy uses the same $W_x$, $W_h$, and $b$, so the model learns one transition rule rather than a different rule for every position.

We use a length-4 scalar sequence so the full trajectory is easy to print and plot.

```python
seq_unroll_w = np.array([0.2, 1.0, -0.5, 0.7])  # Create a four-step scalar sequence.
W_x_unroll_w = np.array([[0.6], [-0.4]])  # Map each scalar input into a 2-D hidden state.
W_h_unroll_w = np.array([[0.5, 0.1], [-0.2, 0.4]])  # Share the same recurrent matrix at every timestep.
b_unroll_w = np.array([0.0, 0.05])  # Share the same bias at every timestep.
h_unroll_w = np.zeros(2)  # Start with a zero hidden state before the first input.
history_unroll_w = []  # Prepare a list to store h_t after every timestep.
print("sequence:", seq_unroll_w)  # Inspect the inputs that will be read in order.
print("initial h_0:", h_unroll_w)  # Inspect the starting memory.
```
▶ What you'll see: four scalar inputs and a zero initial hidden state.

```python
for t_w, x_scalar_w in enumerate(seq_unroll_w, start=1):  # Visit the sequence from left to right.
    x_vec_w = np.array([x_scalar_w])  # Wrap the scalar as a length-1 vector for matrix multiplication.
    preact_unroll_w = W_x_unroll_w @ x_vec_w + W_h_unroll_w @ h_unroll_w + b_unroll_w  # Reuse the same weights for this timestep.
    h_unroll_w = np.tanh(preact_unroll_w)  # Update the hidden state with the vanilla RNN rule.
    history_unroll_w.append(h_unroll_w.copy())  # Save a copy so later updates do not overwrite it.
    print(f"t={t_w} x_t={x_scalar_w:+.2f} h_t={np.round(h_unroll_w, 3)}")  # Print each intermediate hidden state.
history_unroll_w = np.array(history_unroll_w)  # Convert the saved states into a time-by-hidden array.
```
▶ What you'll see: each timestep's input and the hidden state produced after reading it.

```python
plt.figure(figsize=(6.0, 3.5))  # Create a time-series plot for hidden-state evolution.
plt.plot(range(1, len(seq_unroll_w) + 1), history_unroll_w[:, 0], marker="o", label="hidden 0")  # Plot coordinate 0 over time.
plt.plot(range(1, len(seq_unroll_w) + 1), history_unroll_w[:, 1], marker="s", label="hidden 1")  # Plot coordinate 1 over time.
plt.axhline(0.0, color="black", linewidth=1.0)  # Mark zero as a reference line.
plt.xticks(range(1, len(seq_unroll_w) + 1))  # Show integer timesteps on the x-axis.
plt.xlabel("timestep")  # Label time.
plt.ylabel("hidden value")  # Label hidden-state magnitude.
plt.legend(loc="best")  # Identify the two hidden coordinates.
plt.title("2: unrolled RNN shares one update rule")  # Title the subsection figure.
plt.show()  # Render the hidden-state trajectory.
```
Unrolling is a bookkeeping view, not a new model: the same parameters appear in every unrolled copy. During learning, gradients from all timesteps add together because they all point back to those shared weights.
▶ What you'll see: two hidden coordinates changing as the same recurrent rule processes four inputs.

*Why it's done this way: sharing the same weights lets an RNN handle variable-length sequences and learn position-independent patterns like "update memory when this kind of input appears."*

#### 3. Gates with sigmoid: a soft on/off valve for vectors

A gate is a vector of numbers between 0 and 1, usually made with the sigmoid function

$$
\sigma(z)=\frac{1}{1+e^{-z}}.
$$

Multiplying $g\odot v$ keeps a fraction of each coordinate of $v$: values near 0 erase, values near 1 keep, and middle values partially pass information. We build the gate separately because LSTMs and GRUs are mostly clever ways to decide these soft valves.

```python
def sigmoid_w(z_w):  # Define the sigmoid gate nonlinearity for this walkthrough.
    return 1.0 / (1.0 + np.exp(-np.clip(z_w, -60.0, 60.0)))  # Clip logits so exponentials stay numerically safe.

logits_gate_w = np.array([-2.0, 0.0, 1.5])  # Choose three gate logits before sigmoid.
gate_w = sigmoid_w(logits_gate_w)  # Convert logits into [0, 1] gate values.
value_gate_w = np.array([10.0, -4.0, 2.0])  # Create a vector whose coordinates will be filtered.
gated_value_w = gate_w * value_gate_w  # Apply elementwise gating g ⊙ v.
print("gate logits:", logits_gate_w)  # Inspect the raw gate inputs.
print("sigmoid gate:", np.round(gate_w, 3))  # Inspect the soft keep fractions.
print("value v:", value_gate_w)  # Inspect the vector before gating.
print("g ⊙ v:", np.round(gated_value_w, 3))  # Inspect the vector after gating.
```
▶ What you'll see: each coordinate of the vector is scaled by its own sigmoid-produced fraction.

```python
z_curve_w = np.linspace(-6.0, 6.0, 300)  # Create a range of possible gate logits.
g_curve_w = sigmoid_w(z_curve_w)  # Convert every logit into a gate value.
plt.figure(figsize=(5.5, 3.4))  # Create the sigmoid curve figure.
plt.plot(z_curve_w, g_curve_w, linewidth=2.0, color="tab:green")  # Draw the soft valve shape.
plt.scatter(logits_gate_w, gate_w, color="black", zorder=3, label="example gates")  # Mark the gates used above.
plt.axhline(0.0, color="gray", linestyle=":")  # Mark the lower asymptote.
plt.axhline(1.0, color="gray", linestyle=":")  # Mark the upper asymptote.
plt.axhline(0.5, color="gray", linestyle="--", label="half-open")  # Mark the midpoint where z=0.
plt.xlabel("gate logit z")  # Label the raw gate input.
plt.ylabel("sigmoid gate σ(z)")  # Label the gate output.
plt.legend(loc="best")  # Explain the example markers.
plt.title("3: sigmoid gates are soft valves")  # Title the subsection figure.
plt.show()  # Render the gate curve.
```
The sigmoid is useful for gates because its output is interpretable as a keep fraction. Elementwise multiplication then applies that fraction independently to every coordinate.
▶ What you'll see: a smooth curve that saturates near 0 and 1, with $\sigma(0)=0.5$.

*Why it's done this way: gates make memory differentiable and selective — the model can softly erase, keep, or mix information without a hard if/else decision.*

#### 4. LSTM cell: forget, input, output gates plus additive cell memory

An LSTM separates long-term cell memory $c_t$ from exposed hidden state $h_t$. Its core update is

$$
c_t=f\odot c_{t-1}+i\odot\widetilde c,
\qquad
h_t=o\odot\tanh(c_t).
$$

The forget gate $f$ decides how much old cell state remains, the input gate $i$ decides how much candidate memory $\widetilde c$ enters, and the output gate $o$ decides how much of the cell is exposed as $h_t$. We compute one cell by hand to see every valve and memory term.

```python
x_lstm_w = np.array([0.6, -0.1])  # Store the current input vector.
h_prev_lstm_w = np.array([0.2, -0.3])  # Store the previous exposed hidden state.
c_prev_lstm_w = np.array([0.8, -0.5])  # Store the previous internal cell memory.
combo_lstm_w = np.concatenate([x_lstm_w, h_prev_lstm_w])  # Concatenate input and old hidden state for gate calculations.
print("x_t:", x_lstm_w)  # Inspect the current input.
print("h_{t-1}:", h_prev_lstm_w)  # Inspect the previous hidden state.
print("c_{t-1}:", c_prev_lstm_w)  # Inspect the previous cell state.
```
▶ What you'll see: the three ingredients entering one LSTM timestep.

```python
W_f_lstm_w = np.array([[0.7, -0.2, 0.4, 0.1], [-0.3, 0.5, 0.2, 0.6]])  # Weights for the forget gate.
b_f_lstm_w = np.array([0.6, 0.2])  # Positive forget bias encourages remembering at the start.
W_i_lstm_w = np.array([[0.2, 0.4, -0.1, 0.3], [0.5, -0.3, 0.2, -0.2]])  # Weights for the input gate.
b_i_lstm_w = np.array([-0.1, 0.0])  # Bias for deciding how much new candidate enters.
W_c_lstm_w = np.array([[0.3, 0.2, 0.5, -0.4], [-0.4, 0.6, 0.1, 0.2]])  # Weights for the candidate cell proposal.
b_c_lstm_w = np.array([0.0, 0.05])  # Bias for the candidate cell proposal.
W_o_lstm_w = np.array([[0.4, -0.5, 0.2, 0.3], [0.1, 0.2, -0.3, 0.5]])  # Weights for the output gate.
b_o_lstm_w = np.array([0.0, 0.1])  # Bias for deciding what cell content to expose.
```

```python
f_lstm_w = sigmoid_w(W_f_lstm_w @ combo_lstm_w + b_f_lstm_w)  # Compute the forget gate f in [0, 1].
i_lstm_w = sigmoid_w(W_i_lstm_w @ combo_lstm_w + b_i_lstm_w)  # Compute the input gate i in [0, 1].
c_tilde_lstm_w = np.tanh(W_c_lstm_w @ combo_lstm_w + b_c_lstm_w)  # Compute candidate memory c tilde in [-1, 1].
o_lstm_w = sigmoid_w(W_o_lstm_w @ combo_lstm_w + b_o_lstm_w)  # Compute the output gate o in [0, 1].
print("forget f:", np.round(f_lstm_w, 3))  # Inspect how much old cell memory is kept.
print("input i:", np.round(i_lstm_w, 3))  # Inspect how much candidate memory is admitted.
print("candidate c_tilde:", np.round(c_tilde_lstm_w, 3))  # Inspect the proposed new memory.
print("output o:", np.round(o_lstm_w, 3))  # Inspect how much memory will be exposed.
```
▶ What you'll see: all three gates plus the candidate memory vector for this one LSTM step.

```python
c_lstm_w = f_lstm_w * c_prev_lstm_w + i_lstm_w * c_tilde_lstm_w  # Update cell state with an additive keep-plus-write rule.
h_lstm_w = o_lstm_w * np.tanh(c_lstm_w)  # Expose a gated, squashed version of the cell state as h_t.
print("kept old memory f ⊙ c_{t-1}:", np.round(f_lstm_w * c_prev_lstm_w, 3))  # Show the retained old-memory term.
print("written new memory i ⊙ c_tilde:", np.round(i_lstm_w * c_tilde_lstm_w, 3))  # Show the new-memory write term.
print("new c_t:", np.round(c_lstm_w, 3))  # Inspect the updated internal cell state.
print("new h_t:", np.round(h_lstm_w, 3))  # Inspect the exposed hidden state.
```
The additive cell state helps fight vanishing gradients because the path from $c_{t-1}$ to $c_t$ includes multiplication by $f$ and addition, not a fresh full matrix and $\tanh$ at every step. When $f\approx1$, the gradient through $c$ can flow largely unchanged.
▶ What you'll see: the old-memory term and new-memory term add to make the new cell state.

```python
gate_names_lstm_w = ["forget", "input", "output"]  # Name the three sigmoid gates to compare.
gate_means_lstm_w = [f_lstm_w.mean(), i_lstm_w.mean(), o_lstm_w.mean()]  # Average each gate across coordinates for a compact plot.
plt.figure(figsize=(5.5, 3.4))  # Create the LSTM gate summary figure.
plt.bar(gate_names_lstm_w, gate_means_lstm_w, color=["tab:blue", "tab:orange", "tab:green"])  # Plot mean openness of each gate.
plt.ylim(0.0, 1.0)  # Use the natural sigmoid range.
plt.ylabel("mean gate value")  # Label the gate openness scale.
plt.title("4: LSTM gates control keep, write, reveal")  # Title the subsection figure.
plt.show()  # Render the gate bar chart.
```
▶ What you'll see: forget, input, and output gates as soft valve values between 0 and 1.

*Why it's done this way: the LSTM gives memory a nearly linear additive highway, then uses gates to decide what to keep, write, and reveal, making long-range dependencies easier to preserve than in a plain tanh recurrence.*

#### 5. GRU cell: update and reset gates for a lighter memory blend

A GRU compresses the gating idea into fewer moving parts than an LSTM. The update gate $z$ directly blends old hidden state with a candidate hidden state:

$$
h_t=(1-z)\odot h_{t-1}+z\odot\widetilde h.
$$

The reset gate $r$ controls how much previous state is used while forming the candidate $\widetilde h$. We build the blend explicitly because it shows the GRU's main simplification: no separate cell state, just a gated hidden-state update.

```python
x_gru_w = np.array([0.4, -0.6])  # Store the current input vector.
h_prev_gru_w = np.array([0.7, -0.2])  # Store the previous GRU hidden state.
combo_gru_w = np.concatenate([x_gru_w, h_prev_gru_w])  # Concatenate input and old hidden state for gates.
W_z_gru_w = np.array([[0.5, -0.1, 0.3, 0.2], [-0.4, 0.6, 0.1, -0.2]])  # Weights for the update gate z.
b_z_gru_w = np.array([0.0, 0.1])  # Bias for the update gate.
W_r_gru_w = np.array([[0.2, 0.4, -0.3, 0.5], [0.6, -0.2, 0.2, 0.1]])  # Weights for the reset gate r.
b_r_gru_w = np.array([0.1, -0.1])  # Bias for the reset gate.
print("x_t:", x_gru_w)  # Inspect the current input.
print("h_{t-1}:", h_prev_gru_w)  # Inspect the old hidden state before gating.
```
▶ What you'll see: the input and old hidden vector that the GRU will mix.

```python
z_gru_w = sigmoid_w(W_z_gru_w @ combo_gru_w + b_z_gru_w)  # Compute update gate z in [0, 1].
r_gru_w = sigmoid_w(W_r_gru_w @ combo_gru_w + b_r_gru_w)  # Compute reset gate r in [0, 1].
reset_hidden_gru_w = r_gru_w * h_prev_gru_w  # Apply reset gate before building the candidate hidden state.
combo_candidate_gru_w = np.concatenate([x_gru_w, reset_hidden_gru_w])  # Combine input with reset-filtered old memory.
W_h_gru_w = np.array([[0.3, -0.2, 0.7, 0.1], [-0.5, 0.4, 0.2, 0.6]])  # Weights for the candidate hidden state.
b_h_gru_w = np.array([0.0, 0.05])  # Bias for the candidate hidden state.
h_tilde_gru_w = np.tanh(W_h_gru_w @ combo_candidate_gru_w + b_h_gru_w)  # Compute the candidate hidden state.
print("update z:", np.round(z_gru_w, 3))  # Inspect the old-vs-new blend fractions.
print("reset r:", np.round(r_gru_w, 3))  # Inspect how much old hidden state enters the candidate.
print("candidate h_tilde:", np.round(h_tilde_gru_w, 3))  # Inspect the proposed new hidden state.
```
▶ What you'll see: the update gate, reset gate, and candidate state for one GRU step.

```python
old_part_gru_w = (1.0 - z_gru_w) * h_prev_gru_w  # Compute the retained old-state contribution.
new_part_gru_w = z_gru_w * h_tilde_gru_w  # Compute the admitted candidate-state contribution.
h_gru_w = old_part_gru_w + new_part_gru_w  # Add both parts to form the new hidden state.
print("(1-z) ⊙ h_{t-1}:", np.round(old_part_gru_w, 3))  # Show the old-memory share.
print("z ⊙ h_tilde:", np.round(new_part_gru_w, 3))  # Show the new-candidate share.
print("new h_t:", np.round(h_gru_w, 3))  # Inspect the final blended hidden state.
```
The update gate is a per-coordinate interpolation knob. If $z$ is near 0, the old hidden state passes through; if $z$ is near 1, the candidate mostly replaces it.
▶ What you'll see: old and new contributions add coordinatewise to produce the final GRU state.

```python
z_grid_gru_w = np.linspace(0.0, 1.0, 101)  # Create possible scalar update-gate values from closed to open.
old_scalar_gru_w = 0.7  # Choose one old hidden value to visualize.
new_scalar_gru_w = -0.3  # Choose one candidate hidden value to visualize.
blend_grid_gru_w = (1.0 - z_grid_gru_w) * old_scalar_gru_w + z_grid_gru_w * new_scalar_gru_w  # Blend old and new for every z.
plt.figure(figsize=(5.5, 3.4))  # Create the GRU blend figure.
plt.plot(z_grid_gru_w, blend_grid_gru_w, linewidth=2.0, color="tab:red")  # Draw how the hidden value changes with z.
plt.scatter(z_gru_w, (1.0 - z_gru_w) * h_prev_gru_w + z_gru_w * h_tilde_gru_w, color="black", zorder=3, label="actual coordinates")  # Mark this cell's coordinate blends.
plt.xlabel("update gate z")  # Label the gate axis.
plt.ylabel("blended hidden value")  # Label the resulting hidden value.
plt.legend(loc="best")  # Explain the marked coordinates.
plt.title("5: GRU update gate blends old and new state")  # Title the subsection figure.
plt.show()  # Render the blend plot.
```
▶ What you'll see: a straight interpolation from the old value at $z=0$ to the candidate value at $z=1$.

*Why it's done this way: the GRU is a lighter gating scheme because it merges memory and hidden state into one vector and uses the update gate to perform the same keep-versus-write decision with fewer parameters than an LSTM.*


### 🟢 Basics (warm-up)

#### B1. One tanh RNN hidden-state update

Use $a^{<t-1>}=0.40$, $x^{<t>}=1.50$, $w_{aa}=0.50$, $w_{ax}=-0.20$, and $b_a=0.10$.

$$
\begin{aligned}
z^{<t>} &= w_{aa}a^{<t-1>}+w_{ax}x^{<t>}+b_a\\
&=(0.50)(0.40)+(-0.20)(1.50)+0.10\\
&=0.20-0.30+0.10\\
&=0.00.
\end{aligned}
$$

Then

$$
\begin{aligned}
a^{<t>} &= \tanh(z^{<t>})\\
&=\tanh(0.00)\\
&=0.00.
\end{aligned}
$$

Therefore

$$
\boxed{z^{<t>}=0.00},\qquad \boxed{a^{<t>}=0.00}.
$$

```python
a_prev_b1 = 0.40  # set the previous hidden state from the worked example.
x_t_b1 = 1.50  # set the current input from the worked example.
w_aa_b1 = 0.50  # set the recurrent weight from the worked example.
w_ax_b1 = -0.20  # set the input weight from the worked example.
b_a_b1 = 0.10  # set the hidden bias from the worked example.
z_t_b1 = w_aa_b1 * a_prev_b1 + w_ax_b1 * x_t_b1 + b_a_b1  # build the pre-activation.
z_t_b1 = 0.0 if abs(z_t_b1) < 1e-12 else z_t_b1  # remove floating-point negative zero for display.
a_t_b1 = np.tanh(z_t_b1)  # apply tanh to get the new hidden state.
a_t_b1 = 0.0 if abs(a_t_b1) < 1e-12 else a_t_b1  # remove floating-point negative zero for display.
print(f"z: {z_t_b1:.2f}, hidden: {a_t_b1:.2f}")  # show the boxed values.
```

▶ What you'll see: the pre-activation and hidden state are both 0.0.

👀 Takeaway: tanh passes a zero pre-activation to a zero hidden state.

#### B2. One sigmoid gate value

Use $x^{<t>}=2$, $a^{<t-1>}=-1$, $w=0.70$, $u=0.30$, and $b=-0.20$.

$$
\begin{aligned}
z&=wx^{<t>}+ua^{<t-1>}+b\\
&=(0.70)(2)+(0.30)(-1)-0.20\\
&=1.40-0.30-0.20\\
&=0.90.
\end{aligned}
$$

$$
\begin{aligned}
\Gamma&=\sigma(0.90)\\
&=\frac{1}{1+e^{-0.90}}\\
&\approx\frac{1}{1+0.4066}\\
&\approx0.711.
\end{aligned}
$$

So

$$
\boxed{\Gamma\approx0.711},
$$

meaning the gate is mostly open.

```python
x_t_b2 = 2.0  # set the current input from the worked example.
a_prev_b2 = -1.0  # set the previous hidden state from the worked example.
w_b2 = 0.70  # set the input weight from the worked example.
u_b2 = 0.30  # set the recurrent weight from the worked example.
b_b2 = -0.20  # set the gate bias from the worked example.
z_b2 = w_b2 * x_t_b2 + u_b2 * a_prev_b2 + b_b2  # build the gate logit.
gamma_b2 = 1 / (1 + np.exp(-z_b2))  # apply the sigmoid gate.
print("gate value:", round(float(gamma_b2), 3))  # show the boxed gate value.
```

▶ What you'll see: the sigmoid gate value is 0.711.

👀 Takeaway: positive gate logits produce mostly open gates.

```python
x_t_b2 = 2.0  # set the current input from the worked example.
a_prev_b2 = -1.0  # set the previous hidden state from the worked example.
w_b2 = 0.70  # set the input weight from the worked example.
u_b2 = 0.30  # set the recurrent weight from the worked example.
b_b2 = -0.20  # set the gate bias from the worked example.
z_b2 = w_b2 * x_t_b2 + u_b2 * a_prev_b2 + b_b2  # rebuild the worked-example gate logit.
gamma_b2 = 1 / (1 + np.exp(-z_b2))  # rebuild the worked-example gate activation.
z_values_b2 = np.linspace(-4, 4, 200)  # create logits for a sigmoid curve.
gate_values_b2 = 1 / (1 + np.exp(-z_values_b2))  # convert logits to gate activations.
plt.plot(z_values_b2, gate_values_b2)  # draw the sigmoid activation curve.
plt.scatter([z_b2], [gamma_b2], color="red")  # mark the worked-example gate value.
plt.title("B2: sigmoid gate value")  # title the micro-visualization.
plt.xlabel("logit z")  # label the horizontal axis.
plt.ylabel("gate Γ")  # label the vertical axis.
plt.show()  # display the figure.
```

▶ What you'll see: the worked gate sits above 0.5 on the sigmoid curve.

#### B3. Unroll a length-3 scalar RNN

Let $a^{<0>}=0$, $w_{aa}=0.50$, $w_{ax}=1.00$, $b_a=0$, and $x^{<1:3>}=[1,0,1]$.

$$
a^{<t>}=\tanh(0.50a^{<t-1>}+x^{<t>}).
$$

For $t=1$:

$$
z^{<1>}=0.50(0)+1=1,
\qquad
 a^{<1>}=\tanh(1)\approx0.7616.
$$

For $t=2$:

$$
z^{<2>}=0.50(0.7616)+0=0.3808,
\qquad
 a^{<2>}=\tanh(0.3808)\approx0.3634.
$$

For $t=3$:

$$
z^{<3>}=0.50(0.3634)+1=1.1817,
\qquad
 a^{<3>}=\tanh(1.1817)\approx0.8280.
$$

Thus

$$
\boxed{(a^{<1>},a^{<2>},a^{<3>})\approx(0.7616,0.3634,0.8280)}.
$$

```python
a_prev_b3 = 0.0  # start from the initial hidden state.
w_aa_b3 = 0.50  # set the recurrent weight from the worked example.
w_ax_b3 = 1.00  # set the input weight from the worked example.
b_a_b3 = 0.0  # set the hidden bias from the worked example.
x_seq_b3 = np.array([1.0, 0.0, 1.0])  # build the three-step input sequence.
a_values_b3 = []  # prepare a list to store hidden states.
for x_t_b3 in x_seq_b3:  # unroll the scalar RNN across the sequence.
    z_t_b3 = w_aa_b3 * a_prev_b3 + w_ax_b3 * x_t_b3 + b_a_b3  # compute this step's pre-activation.
    a_prev_b3 = np.tanh(z_t_b3)  # compute this step's hidden state.
    a_values_b3.append(float(a_prev_b3))  # save the hidden state for printing.
formatted_values_b3 = ", ".join(f"{value_b3:.4f}" for value_b3 in a_values_b3)  # format values like the boxed tuple.
print(f"hidden states: ({formatted_values_b3})")  # show the boxed tuple.
```

▶ What you'll see: the hidden states are [0.7616, 0.3634, 0.8280].

👀 Takeaway: each hidden state depends on both the current input and the previous state.

```python
a_prev_b3 = 0.0  # start from the initial hidden state.
w_aa_b3 = 0.50  # set the recurrent weight from the worked example.
w_ax_b3 = 1.00  # set the input weight from the worked example.
b_a_b3 = 0.0  # set the hidden bias from the worked example.
x_seq_b3 = np.array([1.0, 0.0, 1.0])  # rebuild the three-step input sequence.
a_values_b3 = []  # prepare a list to store hidden states.
for x_t_b3 in x_seq_b3:  # unroll the scalar RNN across the sequence.
    z_t_b3 = w_aa_b3 * a_prev_b3 + w_ax_b3 * x_t_b3 + b_a_b3  # compute this step's pre-activation.
    a_prev_b3 = np.tanh(z_t_b3)  # compute this step's hidden state.
    a_values_b3.append(float(a_prev_b3))  # save the hidden state for plotting.
steps_b3 = np.arange(1, 4)  # create timestep labels.
plt.plot(steps_b3, a_values_b3, marker="o")  # draw hidden-state evolution.
plt.title("B3: scalar RNN hidden states")  # title the micro-visualization.
plt.xlabel("timestep")  # label the horizontal axis.
plt.ylabel("hidden state")  # label the vertical axis.
plt.xticks(steps_b3)  # show integer timesteps.
plt.show()  # display the figure.
```

▶ What you'll see: the hidden state dips when the middle input is 0 and rises again at the final 1.

#### B4. Forget gate times previous cell memory

Use previous cell memory $c^{<t-1>}=[2.0,-1.0,0.5]$ and forget gate $\Gamma_f=[0.9,0.1,0.6]$.

$$
\begin{aligned}
\Gamma_f*c^{<t-1>}
&=[0.9,0.1,0.6]*[2.0,-1.0,0.5]\\
&=[0.9(2.0),0.1(-1.0),0.6(0.5)]\\
&=[1.8,-0.1,0.3].
\end{aligned}
$$

Therefore

$$
\boxed{\Gamma_f*c^{<t-1>}=[1.8,-0.1,0.3]}.
$$

Large forget-gate values keep memory; small values erase it.

```python
c_prev_b4 = np.array([2.0, -1.0, 0.5])  # build the previous cell-memory vector.
gamma_f_b4 = np.array([0.9, 0.1, 0.6])  # build the forget-gate vector.
kept_memory_b4 = gamma_f_b4 * c_prev_b4  # multiply gate and memory elementwise.
print("kept memory:", np.round(kept_memory_b4, 1).tolist())  # show the boxed vector.
```

▶ What you'll see: the kept memory is [1.8, -0.1, 0.3].

👀 Takeaway: forget gates scale each memory coordinate independently.

```python
c_prev_b4 = np.array([2.0, -1.0, 0.5])  # rebuild the previous cell-memory vector.
gamma_f_b4 = np.array([0.9, 0.1, 0.6])  # rebuild the forget-gate vector.
kept_memory_b4 = gamma_f_b4 * c_prev_b4  # rebuild the gated memory vector.
indices_b4 = np.arange(len(c_prev_b4))  # create coordinate indices.
plt.bar(indices_b4 - 0.15, c_prev_b4, width=0.3, label="previous c")  # plot previous memory values.
plt.bar(indices_b4 + 0.15, kept_memory_b4, width=0.3, label="kept Γf*c")  # plot gated memory values.
plt.title("B4: forget gate keeps memory")  # title the micro-visualization.
plt.xlabel("memory coordinate")  # label the horizontal axis.
plt.ylabel("value")  # label the vertical axis.
plt.legend()  # show the legend.
plt.show()  # display the figure.
```

▶ What you'll see: each bar shrinks according to its forget-gate value.

#### B5. One GRU update-gate blend

Use previous memory $c^{<t-1>}=0.20$, candidate memory $\widetilde c^{<t>}=0.90$, and update gate $\Gamma_u=0.75$.

$$
\begin{aligned}
c^{<t>}
&=\Gamma_u\widetilde c^{<t>}+(1-\Gamma_u)c^{<t-1>}\\
&=(0.75)(0.90)+(1-0.75)(0.20)\\
&=0.675+0.050\\
&=0.725.
\end{aligned}
$$

Thus

$$
\boxed{c^{<t>}=0.725}.
$$

The new state is mostly the candidate because the update gate is high.

```python
c_prev_b5 = 0.20  # set the previous memory from the worked example.
c_tilde_b5 = 0.90  # set the candidate memory from the worked example.
gamma_u_b5 = 0.75  # set the update gate from the worked example.
candidate_part_b5 = gamma_u_b5 * c_tilde_b5  # compute the candidate contribution.
previous_part_b5 = (1 - gamma_u_b5) * c_prev_b5  # compute the previous-memory contribution.
c_t_b5 = candidate_part_b5 + previous_part_b5  # blend the two contributions.
print("new state:", round(float(c_t_b5), 3))  # show the boxed state.
```

▶ What you'll see: the new GRU state is 0.725.

👀 Takeaway: a high update gate pulls the state toward the candidate.

```python
c_prev_b5 = 0.20  # set the previous memory from the worked example.
c_tilde_b5 = 0.90  # set the candidate memory from the worked example.
gamma_u_b5 = 0.75  # set the update gate from the worked example.
candidate_part_b5 = gamma_u_b5 * c_tilde_b5  # rebuild the candidate contribution.
previous_part_b5 = (1 - gamma_u_b5) * c_prev_b5  # rebuild the previous-memory contribution.
plt.bar(["candidate part", "previous part"], [candidate_part_b5, previous_part_b5])  # compare blend contributions.
plt.title("B5: GRU update-gate blend")  # title the micro-visualization.
plt.ylabel("contribution")  # label the vertical axis.
plt.show()  # display the figure.
```

▶ What you'll see: the candidate contribution is much larger than the previous-state contribution.

#### B6. One LSTM cell-state update

Use $\Gamma_f=0.80$, $c^{<t-1>}=1.50$, $\Gamma_u=0.30$, and $\widetilde c^{<t>}=-0.40$.

$$
\begin{aligned}
c^{<t>}
&=\Gamma_f c^{<t-1>}+\Gamma_u\widetilde c^{<t>}\\
&=(0.80)(1.50)+(0.30)(-0.40)\\
&=1.20-0.12\\
&=1.08.
\end{aligned}
$$

So

$$
\boxed{c^{<t>}=1.08}.
$$

The old memory remains dominant because the forget gate is larger than the update gate.

```python
gamma_f_b6 = 0.80  # set the forget gate from the worked example.
c_prev_b6 = 1.50  # set the previous cell state from the worked example.
gamma_u_b6 = 0.30  # set the update gate from the worked example.
c_tilde_b6 = -0.40  # set the candidate cell state from the worked example.
forget_part_b6 = gamma_f_b6 * c_prev_b6  # compute retained old memory.
update_part_b6 = gamma_u_b6 * c_tilde_b6  # compute added candidate memory.
c_t_b6 = forget_part_b6 + update_part_b6  # combine both LSTM cell-state terms.
print("cell state:", round(float(c_t_b6), 2))  # show the boxed cell state.
```

▶ What you'll see: the updated LSTM cell state is 1.08.

👀 Takeaway: LSTM memory changes by adding a retained old part and a gated candidate part.

```python
gamma_f_b6 = 0.80  # set the forget gate from the worked example.
c_prev_b6 = 1.50  # set the previous cell state from the worked example.
gamma_u_b6 = 0.30  # set the update gate from the worked example.
c_tilde_b6 = -0.40  # set the candidate cell state from the worked example.
forget_part_b6 = gamma_f_b6 * c_prev_b6  # rebuild retained old memory.
update_part_b6 = gamma_u_b6 * c_tilde_b6  # rebuild added candidate memory.
c_t_b6 = forget_part_b6 + update_part_b6  # rebuild the new cell state.
plt.bar(["forget part", "update part", "new c"], [forget_part_b6, update_part_b6, c_t_b6])  # visualize the signed update.
plt.title("B6: LSTM cell-state update")  # title the micro-visualization.
plt.ylabel("value")  # label the vertical axis.
plt.show()  # display the figure.
```

▶ What you'll see: the positive forget part dominates the small negative update part.

#### B7. LSTM output gate reveals hidden state

Use output gate $\Gamma_o=0.60$ and cell state $c^{<t>}=1.08$.

$$
\begin{aligned}
a^{<t>}
&=\Gamma_o\tanh(c^{<t>})\\
&=0.60\tanh(1.08)\\
&\approx0.60(0.793)\\
&\approx0.476.
\end{aligned}
$$

Therefore

$$
\boxed{a^{<t>}\approx0.476}.
$$

The cell can store more than the hidden state exposes.

```python
gamma_o_b7 = 0.60  # set the output gate from the worked example.
c_t_b7 = 1.08  # set the cell state from the worked example.
tanh_c_b7 = np.tanh(c_t_b7)  # squash the cell state before exposure.
a_t_b7 = gamma_o_b7 * tanh_c_b7  # apply the output gate to reveal hidden state.
print("hidden state:", round(float(a_t_b7), 3))  # show the boxed hidden state.
```

▶ What you'll see: the exposed hidden state is 0.476.

👀 Takeaway: the output gate controls how much stored cell information becomes visible.

```python
gamma_o_b7 = 0.60  # set the output gate from the worked example.
c_t_b7 = 1.08  # set the cell state from the worked example.
tanh_c_b7 = np.tanh(c_t_b7)  # rebuild the squashed cell state.
a_t_b7 = gamma_o_b7 * tanh_c_b7  # rebuild the exposed hidden state.
plt.bar(["tanh(c)", "Γo*tanh(c)"], [tanh_c_b7, a_t_b7])  # compare stored signal and exposed signal.
plt.title("B7: output gate exposure")  # title the micro-visualization.
plt.ylabel("value")  # label the vertical axis.
plt.show()  # display the figure.
```

▶ What you'll see: the output gate lowers the visible hidden-state value below tanh(c).

#### B8. Clip one exploding scalar gradient

Use raw gradient $g=7.5$ and clipping threshold $C=2.0$.

Because $|g|>C$, clip to the threshold while preserving the sign:

$$
\begin{aligned}
g_{\text{clipped}}
&=C\frac{g}{|g|}\\
&=2.0\frac{7.5}{7.5}\\
&=2.0.
\end{aligned}
$$

Thus

$$
\boxed{g_{\text{clipped}}=2.0}.
$$

Clipping limits the update size without changing the descent direction in one dimension.

```python
g_b8 = 7.5  # set the raw gradient from the worked example.
C_b8 = 2.0  # set the clipping threshold from the worked example.
g_clipped_b8 = C_b8 * g_b8 / abs(g_b8) if abs(g_b8) > C_b8 else g_b8  # clip only if the gradient exceeds the threshold.
print("clipped gradient:", round(float(g_clipped_b8), 1))  # show the boxed clipped gradient.
```

▶ What you'll see: the clipped gradient is 2.0.

👀 Takeaway: clipping caps magnitude while preserving the gradient sign.

#### B9. Count vanilla RNN parameters

Use input size $n_x=4$, hidden size $n_a=3$, and output size $n_y=2$.

The recurrent cell has

$$
W_{ax}: n_a n_x = 3\cdot4=12,
\qquad
W_{aa}: n_a n_a = 3\cdot3=9,
\qquad
b_a: n_a=3.
$$

The output layer has

$$
W_{ya}: n_y n_a = 2\cdot3=6,
\qquad
b_y: n_y=2.
$$

Therefore

$$
\begin{aligned}
\text{total parameters}&=12+9+3+6+2\\
&=32.
\end{aligned}
$$

So

$$
\boxed{32\text{ trainable parameters}}.
$$

The same 32 parameters are reused at every timestep.

```python
n_x_b9 = 4  # set the input size from the worked example.
n_a_b9 = 3  # set the hidden size from the worked example.
n_y_b9 = 2  # set the output size from the worked example.
w_ax_count_b9 = n_a_b9 * n_x_b9  # count input-to-hidden weights.
w_aa_count_b9 = n_a_b9 * n_a_b9  # count hidden-to-hidden weights.
b_a_count_b9 = n_a_b9  # count hidden biases.
w_ya_count_b9 = n_y_b9 * n_a_b9  # count hidden-to-output weights.
b_y_count_b9 = n_y_b9  # count output biases.
total_params_b9 = w_ax_count_b9 + w_aa_count_b9 + b_a_count_b9 + w_ya_count_b9 + b_y_count_b9  # add every trainable parameter.
print("trainable parameters:", total_params_b9)  # show the boxed count.
```

▶ What you'll see: the vanilla RNN has 32 trainable parameters.

👀 Takeaway: recurrent weights are counted once because they are shared across timesteps.

#### B10. One output probability from a hidden state

Use hidden state $a^{<t>}=0.50$, output weight $w_{ya}=1.20$, and output bias $b_y=-0.40$.

$$
\begin{aligned}
z_y^{<t>}
&=w_{ya}a^{<t>}+b_y\\
&=(1.20)(0.50)-0.40\\
&=0.20.
\end{aligned}
$$

Then

$$
\begin{aligned}
\widehat y^{<t>}
&=\sigma(0.20)\\
&=\frac{1}{1+e^{-0.20}}\\
&\approx0.550.
\end{aligned}
$$

Thus

$$
\boxed{\widehat y^{<t>}\approx0.550}.
$$

A hidden state becomes a prediction only after an output layer.

```python
a_t_b10 = 0.50  # set the hidden state from the worked example.
w_ya_b10 = 1.20  # set the output weight from the worked example.
b_y_b10 = -0.40  # set the output bias from the worked example.
z_y_b10 = w_ya_b10 * a_t_b10 + b_y_b10  # compute the output logit.
y_hat_b10 = 1 / (1 + np.exp(-z_y_b10))  # convert the logit to a probability.
print(f"output probability: {y_hat_b10:.3f}")  # show the boxed probability.
```

▶ What you'll see: the output probability is 0.550.

👀 Takeaway: output layers translate hidden states into task predictions.

```python
a_t_b10 = 0.50  # set the hidden state from the worked example.
w_ya_b10 = 1.20  # set the output weight from the worked example.
b_y_b10 = -0.40  # set the output bias from the worked example.
z_y_b10 = w_ya_b10 * a_t_b10 + b_y_b10  # rebuild the output logit.
y_hat_b10 = 1 / (1 + np.exp(-z_y_b10))  # rebuild the output probability.
z_values_b10 = np.linspace(-4, 4, 200)  # create logits for a probability curve.
prob_values_b10 = 1 / (1 + np.exp(-z_values_b10))  # convert logits to probabilities.
plt.plot(z_values_b10, prob_values_b10)  # draw the sigmoid output curve.
plt.scatter([z_y_b10], [y_hat_b10], color="red")  # mark the worked-example prediction.
plt.title("B10: hidden state to probability")  # title the micro-visualization.
plt.xlabel("output logit")  # label the horizontal axis.
plt.ylabel("probability")  # label the vertical axis.
plt.show()  # display the figure.
```

▶ What you'll see: the example logit 0.20 maps to a probability slightly above 0.5.

### 🟡 Easy

#### E1. Hand-unroll a vanilla RNN and output

Use $x=[1,0,1]$, $a^{<0>}=0$, $w_{aa}=0.25$, $w_{ax}=0.80$, $b_a=-0.10$, and final output $\widehat y=\sigma(1.20a^{<3>}-0.30)$.

At $t=1$:

$$
z^{<1>}=0.25(0)+0.80(1)-0.10=0.70,
\qquad
a^{<1>}=\tanh(0.70)\approx0.6044.
$$

At $t=2$:

$$
z^{<2>}=0.25(0.6044)+0.80(0)-0.10=0.0511,
\qquad
a^{<2>}=\tanh(0.0511)\approx0.0511.
$$

At $t=3$:

$$
z^{<3>}=0.25(0.0511)+0.80(1)-0.10=0.7128,
\qquad
a^{<3>}=\tanh(0.7128)\approx0.6125.
$$

Final logit and probability:

$$
\begin{aligned}
z_y&=1.20a^{<3>}-0.30\\
&=1.20(0.6125)-0.30\\
&=0.4350,\\
\widehat y&=\sigma(0.4350)\approx0.6071.
\end{aligned}
$$

$$
\boxed{\widehat y\approx0.6071}.
$$

#### E2. One GRU timestep by hand

Let $x^{<t>}=1.20$, $a^{<t-1>}=c^{<t-1>}=0.50$.

Parameters:

$$
W_u=0.40,\ U_u=-0.20,\ b_u=0.10,
\qquad
W_r=-0.30,\ U_r=0.80,\ b_r=-0.10.
$$

Candidate parameters are $W_{c,a}=0.60$, $W_{c,x}=0.20$, $b_c=0.05$.

Update gate:

$$
\begin{aligned}
z_u&=(0.40)(1.20)+(-0.20)(0.50)+0.10=0.48,\\
\Gamma_u&=\sigma(0.48)\approx0.6177.
\end{aligned}
$$

Relevance gate:

$$
\begin{aligned}
z_r&=(-0.30)(1.20)+(0.80)(0.50)-0.10=-0.06,\\
\Gamma_r&=\sigma(-0.06)\approx0.4850.
\end{aligned}
$$

Candidate:

$$
\begin{aligned}
\Gamma_ra^{<t-1>}&=(0.4850)(0.50)=0.2425,\\
z_c&=(0.60)(0.2425)+(0.20)(1.20)+0.05=0.4355,\\
\widetilde c^{<t>}&=\tanh(0.4355)\approx0.4099.
\end{aligned}
$$

Memory update:

$$
\begin{aligned}
c^{<t>}&=\Gamma_u\widetilde c^{<t>}+(1-\Gamma_u)c^{<t-1>}\\
&=(0.6177)(0.4099)+(0.3823)(0.50)\\
&=0.2532+0.1912\\
&=0.4444.
\end{aligned}
$$

For a GRU, $a^{<t>}=c^{<t>}$, so

$$
\boxed{\Gamma_u=0.6177},\quad
\boxed{\Gamma_r=0.4850},\quad
\boxed{\widetilde c^{<t>}=0.4099},\quad
\boxed{a^{<t>}=c^{<t>}=0.4444}.
$$

#### E3. One LSTM timestep by hand

Let $x^{<t>}=0.80$, $a^{<t-1>}=0.30$, and $c^{<t-1>}=0.70$.

$$
\begin{array}{c|ccc}
\text{gate} & W & U & b\\ \hline
\Gamma_f&0.50&0.20&0.40\\
\Gamma_u&-0.40&0.10&0.00\\
\Gamma_r&0.30&-0.60&0.10\\
\Gamma_o&0.20&0.50&-0.20
\end{array}
$$

Candidate parameters: $W_{c,a}=0.70$, $W_{c,x}=-0.10$, $b_c=0.05$.

Forget gate:

$$
z_f=0.50(0.80)+0.20(0.30)+0.40=0.86,
\qquad
\Gamma_f=\sigma(0.86)\approx0.7027.
$$

Update gate:

$$
z_u=-0.40(0.80)+0.10(0.30)+0=-0.29,
\qquad
\Gamma_u=\sigma(-0.29)\approx0.4280.
$$

Relevance gate:

$$
z_r=0.30(0.80)-0.60(0.30)+0.10=0.16,
\qquad
\Gamma_r=\sigma(0.16)\approx0.5399.
$$

Output gate:

$$
z_o=0.20(0.80)+0.50(0.30)-0.20=0.11,
\qquad
\Gamma_o=\sigma(0.11)\approx0.5275.
$$

Candidate:

$$
\begin{aligned}
\Gamma_ra^{<t-1>}&=(0.5399)(0.30)=0.1620,\\
z_c&=(0.70)(0.1620)+(-0.10)(0.80)+0.05=0.0834,\\
\widetilde c^{<t>}&=\tanh(0.0834)\approx0.0832.
\end{aligned}
$$

Cell and hidden state:

$$
\begin{aligned}
c^{<t>}&=\Gamma_u\widetilde c^{<t>}+\Gamma_fc^{<t-1>}\\
&=(0.4280)(0.0832)+(0.7027)(0.70)\\
&=0.0356+0.4919=0.5275,\\
a^{<t>}&=\Gamma_oc^{<t>}=(0.5275)(0.5275)=0.2783.
\end{aligned}
$$

$$
\boxed{c^{<t>}\approx0.5275},\qquad \boxed{a^{<t>}\approx0.2783}.
$$

#### E4. Sequence-shape “hello world”

Goal: run one explicit RNN cell over a short scalar sequence and compare hidden state to a running-sum target.

```python
x_sequence = np.array([1.0, -1.0, 2.0, 0.0, -0.5, 1.5])  # Define a scalar sequence with positive and negative steps.
W_ax = np.array([[0.90]])  # Set the input-to-hidden weight for one hidden unit.
W_aa = np.array([[0.35]])  # Set the recurrent memory weight for one hidden unit.
b_a = np.array([0.00])  # Use zero hidden bias for transparent arithmetic.
W_ya = np.array([[2.00]])  # Set a hidden-to-output weight for a binary probability.
b_y = np.array([0.00])  # Use zero output bias for a neutral threshold.
a_prev = np.array([0.00])  # Initialize hidden memory before the sequence starts.
hidden_states = []  # Store hidden states for plotting.
output_probs = []  # Store output probabilities for plotting.
for x_t in x_sequence:  # Process one timestep at a time.
    x_vec = np.array([x_t])  # Wrap the scalar input as a vector.
    z_t = W_aa @ a_prev + W_ax @ x_vec + b_a  # Compute recurrent pre-activation.
    a_t = tanh(z_t)  # Apply tanh to obtain bounded memory.
    y_t = sigmoid(W_ya @ a_t + b_y)  # Convert hidden state to output probability.
    hidden_states.append(a_t.item())  # Save scalar hidden state.
    output_probs.append(y_t.item())  # Save scalar probability.
    a_prev = a_t  # Carry current state to the next timestep.
hidden_states = np.array(hidden_states)  # Convert hidden list to an array.
output_probs = np.array(output_probs)  # Convert probability list to an array.
running_sum = np.cumsum(x_sequence)  # Compute a transparent target-generating statistic.
targets = (running_sum > 0).astype(float)  # Define binary targets from positive running sum.
plt.figure(figsize=(9, 5))  # Open a larger figure for several curves.
plt.plot(x_sequence, marker="o", label="input")  # Plot raw inputs.
plt.plot(running_sum, marker="s", label="running sum")  # Plot cumulative signal.
plt.plot(hidden_states, marker="^", label="hidden state")  # Plot RNN memory.
plt.plot(output_probs, marker="x", label="output probability")  # Plot output probabilities.
plt.step(np.arange(len(targets)), targets, where="mid", label="target")  # Plot binary targets.
plt.title("E4: one RNN cell reused through time")  # Title the plot.
plt.xlabel("timestep")  # Label the time axis.
plt.ylabel("value")  # Label value axis.
plt.legend()  # Show all curve labels.
plt.tight_layout()  # Prevent clipping.
plt.show()  # Display the visualization.
print("hidden states", np.round(hidden_states, 4))  # Print hidden states for numeric inspection.
print("probabilities", np.round(output_probs, 4))  # Print probabilities for numeric inspection.
```

▶ What you'll see: the hidden state is a bounded running summary, and the output probability rises when the hidden state is positive.

👀 The example shows the core sequence shape: each row $x^{<t>}$ feeds the same cell, and each $a^{<t>}$ feeds the next timestep.

#### E5. Gradient clipping demo

Goal: show how clipping controls an exploding recurrent gradient.

```python
base_gradient = 1.0  # Start with a unit gradient at the final timestep.
recurrent_factor = 1.35  # Use a factor above one so gradients explode backward.
sequence_length = 25  # Simulate twenty-five backward steps.
clip_threshold = 5.0  # Limit scalar gradient magnitude to five.
learning_rate = 0.05  # Use a small learning rate for toy updates.
raw_gradients = []  # Store unclipped gradients.
clipped_gradients = []  # Store clipped gradients.
param_raw = 1.0  # Track a parameter updated by raw gradients.
param_clipped = 1.0  # Track a parameter updated by clipped gradients.
raw_path = []  # Store raw parameter trajectory.
clipped_path = []  # Store clipped parameter trajectory.
for back_step in range(sequence_length):  # Move farther back through time.
    grad = base_gradient * (recurrent_factor ** back_step)  # Compute repeated-gradient multiplication.
    clipped = np.clip(grad, -clip_threshold, clip_threshold)  # Clip the scalar gradient.
    param_raw -= learning_rate * grad  # Apply raw update.
    param_clipped -= learning_rate * clipped  # Apply clipped update.
    raw_gradients.append(grad)  # Save raw gradient.
    clipped_gradients.append(clipped)  # Save clipped gradient.
    raw_path.append(param_raw)  # Save raw parameter value.
    clipped_path.append(param_clipped)  # Save clipped parameter value.
plt.figure(figsize=(10, 4))  # Open a two-panel figure.
plt.subplot(1, 2, 1)  # Select left panel.
plt.plot(raw_gradients, marker="o", label="raw")  # Plot exploding gradients.
plt.plot(clipped_gradients, marker="s", label="clipped")  # Plot capped gradients.
plt.axhline(clip_threshold, color="black", linestyle="--", label="threshold")  # Mark clipping threshold.
plt.title("Gradient magnitude")  # Title left panel.
plt.xlabel("backward step")  # Label backward-step axis.
plt.ylabel("gradient")  # Label gradient axis.
plt.legend()  # Show legend.
plt.subplot(1, 2, 2)  # Select right panel.
plt.plot(raw_path, marker="o", label="raw update")  # Plot raw parameter path.
plt.plot(clipped_path, marker="s", label="clipped update")  # Plot clipped parameter path.
plt.title("Parameter trajectory")  # Title right panel.
plt.xlabel("update")  # Label update axis.
plt.ylabel("parameter")  # Label parameter axis.
plt.legend()  # Show legend.
plt.tight_layout()  # Prevent overlap.
plt.show()  # Display figure.
```

▶ What you'll see: raw gradients grow exponentially, while clipped gradients flatten at the threshold.

👀 Clipping limits update size; it does not create long memory by itself.

### 🔴 Advanced

#### A1. Implement a vanilla RNN cell and show long-memory failure

Goal: implement a trainable scalar RNN cell from scratch and inspect gradient flow on the delayed-copy task.

```python
def train_vanilla_memory_rnn(X, y, epochs=70, lr=0.20):  # Define a full-batch scalar RNN trainer.
    W_ax = np.array([[0.35]])  # Initialize input-to-hidden weight.
    W_aa = np.array([[0.45]])  # Initialize recurrent weight below one to encourage vanishing gradients.
    b_a = np.array([0.00])  # Initialize hidden bias.
    W_ya = np.array([[0.70]])  # Initialize hidden-to-output weight.
    b_y = np.array([0.00])  # Initialize output bias.
    losses = []  # Store mean loss per epoch.
    accuracies = []  # Store mean accuracy per epoch.
    grad_first = []  # Store gradient reaching the first timestep.
    grad_final = []  # Store gradient at the final hidden state.
    for epoch in range(epochs):  # Run gradient descent epochs.
        dW_ax = np.zeros_like(W_ax)  # Reset input-weight gradient.
        dW_aa = np.zeros_like(W_aa)  # Reset recurrent-weight gradient.
        db_a = np.zeros_like(b_a)  # Reset hidden-bias gradient.
        dW_ya = np.zeros_like(W_ya)  # Reset output-weight gradient.
        db_y = np.zeros_like(b_y)  # Reset output-bias gradient.
        total_loss = 0.0  # Reset loss accumulator.
        correct = 0  # Reset accuracy counter.
        first_epoch = []  # Store first-step gradient norms this epoch.
        final_epoch = []  # Store final-step gradient norms this epoch.
        for i in range(X.shape[0]):  # Process each sequence.
            a_values = [np.array([0.0])]  # Store a<0> plus all hidden states.
            for t in range(X.shape[1]):  # Forward pass through time.
                z_t = W_aa @ a_values[-1] + W_ax @ X[i, t] + b_a  # Compute hidden pre-activation.
                a_values.append(tanh(z_t))  # Store hidden state after tanh.
            prob = sigmoid(W_ya @ a_values[-1] + b_y).item()  # Compute final probability.
            total_loss += bce(y[i], prob)  # Add binary cross-entropy.
            correct += int((prob >= 0.5) == bool(y[i]))  # Count correct thresholded prediction.
            dlogit = np.array([prob - y[i]])  # Compute output derivative.
            dW_ya += np.outer(dlogit, a_values[-1])  # Accumulate output-weight gradient.
            db_y += dlogit  # Accumulate output-bias gradient.
            da_next = W_ya.T @ dlogit  # Start backprop from output into final hidden state.
            final_epoch.append(float(np.linalg.norm(da_next)))  # Record final hidden gradient.
            first_seen = 0.0  # Prepare earliest gradient record.
            for t in reversed(range(X.shape[1])):  # Backpropagate through time.
                dz = da_next * (1.0 - a_values[t + 1] ** 2)  # Apply tanh derivative.
                dW_ax += np.outer(dz, X[i, t])  # Accumulate input-weight gradient.
                dW_aa += np.outer(dz, a_values[t])  # Accumulate recurrent-weight gradient.
                db_a += dz  # Accumulate hidden-bias gradient.
                da_next = W_aa.T @ dz  # Propagate gradient to previous hidden state.
                if t == 0:  # Detect the first input timestep.
                    first_seen = float(np.linalg.norm(da_next))  # Save gradient reaching the beginning.
            first_epoch.append(first_seen)  # Store first-step gradient for this example.
        scale = 1.0 / X.shape[0]  # Compute averaging factor.
        W_ax -= lr * dW_ax * scale  # Update input weight.
        W_aa -= lr * dW_aa * scale  # Update recurrent weight.
        b_a -= lr * db_a * scale  # Update hidden bias.
        W_ya -= lr * dW_ya * scale  # Update output weight.
        b_y -= lr * db_y * scale  # Update output bias.
        losses.append(total_loss / X.shape[0])  # Save average loss.
        accuracies.append(correct / X.shape[0])  # Save average accuracy.
        grad_first.append(np.mean(first_epoch))  # Save mean first-step gradient.
        grad_final.append(np.mean(final_epoch))  # Save mean final-step gradient.
    history = {"loss": np.array(losses), "acc": np.array(accuracies), "g_first": np.array(grad_first), "g_final": np.array(grad_final)}  # Pack training history.
    params = {"W_ax": W_ax, "W_aa": W_aa, "b_a": b_a, "W_ya": W_ya, "b_y": b_y}  # Pack learned parameters.
    return params, history  # Return parameters and history.

vanilla_params, vanilla_history = train_vanilla_memory_rnn(copy_X, copy_y)  # Train the vanilla RNN on delayed copy.
plt.figure(figsize=(10, 4))  # Open diagnostic figure.
plt.subplot(1, 2, 1)  # Select performance panel.
plt.plot(vanilla_history["loss"], label="loss")  # Plot training loss.
plt.plot(vanilla_history["acc"], label="accuracy")  # Plot training accuracy.
plt.title("A1: vanilla RNN delayed-copy training")  # Title performance panel.
plt.xlabel("epoch")  # Label epoch axis.
plt.legend()  # Show legend.
plt.subplot(1, 2, 2)  # Select gradient panel.
plt.semilogy(vanilla_history["g_final"], label="final hidden gradient")  # Plot final gradient on log scale.
plt.semilogy(vanilla_history["g_first"], label="first-step gradient")  # Plot first-step gradient on log scale.
plt.title("Vanishing gradient signal")  # Title gradient panel.
plt.xlabel("epoch")  # Label epoch axis.
plt.ylabel("mean norm")  # Label norm axis.
plt.legend()  # Show legend.
plt.tight_layout()  # Prevent overlap.
plt.show()  # Display diagnostics.
print("final vanilla accuracy", round(float(vanilla_history["acc"][-1]), 3))  # Print final accuracy.
```

▶ What you'll see: the gradient at the final hidden state is much larger than the gradient that reaches the first timestep.

👀 The model must remember $x^{<1>}$, but learning arrives mainly at $t=T$.

#### A2. Implement an LSTM cell from scratch and preserve memory

Goal: use an LSTM-style additive cell path to keep the first bit until the final marker.

```python
def lstm_memory_forward(X, forget_bias=4.0, update_bias=-4.0, output_bias=1.0):  # Run a scalar LSTM-style memory cell.
    n_samples, seq_len, _ = X.shape  # Read data dimensions.
    cells = np.zeros((n_samples, seq_len))  # Store cell states.
    hidden = np.zeros((n_samples, seq_len))  # Store hidden states.
    gates = {"forget": np.zeros((n_samples, seq_len)), "update": np.zeros((n_samples, seq_len)), "output": np.zeros((n_samples, seq_len))}  # Store gates.
    probs = np.zeros(n_samples)  # Store final probabilities.
    for i in range(n_samples):  # Process each sequence independently.
        c_prev = 0.0  # Initialize cell memory.
        a_prev = 0.0  # Initialize hidden state.
        for t in range(seq_len):  # Process timesteps.
            x_t = X[i, t, 0]  # Read scalar input.
            is_first = 1.0 if t == 0 else 0.0  # Mark the first timestep.
            is_last = 1.0 if t == seq_len - 1 else 0.0  # Mark the final timestep.
            gamma_f = float(sigmoid(forget_bias))  # Keep memory nearly unchanged.
            gamma_u = float(sigmoid(update_bias + 8.0 * is_first))  # Open update mostly at first step.
            gamma_r = float(sigmoid(4.0))  # Keep previous activation relevant.
            gamma_o = float(sigmoid(output_bias + 8.0 * is_last))  # Reveal memory strongly at final step.
            candidate = float(tanh(3.0 * x_t + 0.1 * gamma_r * a_prev))  # Form candidate memory from input.
            c_t = gamma_u * candidate + gamma_f * c_prev  # Update cell with additive memory path.
            a_t = gamma_o * c_t  # Expose hidden state using CS 230 formula.
            cells[i, t] = c_t  # Save cell state.
            hidden[i, t] = a_t  # Save hidden state.
            gates["forget"][i, t] = gamma_f  # Save forget gate.
            gates["update"][i, t] = gamma_u  # Save update gate.
            gates["output"][i, t] = gamma_o  # Save output gate.
            c_prev = c_t  # Carry cell forward.
            a_prev = a_t  # Carry hidden state forward.
        probs[i] = sigmoid(6.0 * hidden[i, -1] - 2.0)  # Predict initial bit from final hidden state.
    return probs, cells, hidden, gates  # Return predictions, states, and gates.

lstm_probs, lstm_cells, lstm_hidden, lstm_gates = lstm_memory_forward(copy_X)  # Run the LSTM memory cell.
lstm_acc = np.mean((lstm_probs >= 0.5) == copy_y.astype(bool))  # Compute delayed-copy accuracy.
sample_index = int(np.argmax(copy_y))  # Pick a sample whose first bit is one.
time = np.arange(copy_X.shape[1])  # Create timestep indices.
plt.figure(figsize=(10, 5))  # Open gate visualization figure.
plt.plot(time, copy_X[sample_index, :, 0], marker="o", label="input")  # Plot input sequence.
plt.plot(time, lstm_cells[sample_index], marker="s", label="cell c<t>")  # Plot internal cell memory.
plt.plot(time, lstm_hidden[sample_index], marker="^", label="hidden a<t>")  # Plot exposed hidden state.
plt.plot(time, lstm_gates["update"][sample_index], linestyle="--", label="update gate")  # Plot update gate.
plt.plot(time, lstm_gates["forget"][sample_index], linestyle="--", label="forget gate")  # Plot forget gate.
plt.plot(time, lstm_gates["output"][sample_index], linestyle="--", label="output gate")  # Plot output gate.
plt.title(f"A2: LSTM memory path, accuracy={lstm_acc:.3f}")  # Title with accuracy.
plt.xlabel("timestep")  # Label time axis.
plt.ylabel("value")  # Label value axis.
plt.legend()  # Show legend.
plt.tight_layout()  # Prevent clipping.
plt.show()  # Display plot.
print("final LSTM-style accuracy", round(float(lstm_acc), 3))  # Print accuracy.
```

▶ What you'll see: the update gate opens at the first timestep, the forget gate stays near one, and the cell state carries memory across the sequence.

👀 The nearly horizontal cell-state trace is the additive memory path that vanilla RNNs lack.

#### A3. Visualize GRU and LSTM gate activations over text

Goal: compare GRU and LSTM gate heatmaps on small sentiment snippets.

```python
def gru_forward(X, hidden_size=4):  # Run a deterministic GRU feature extractor.
    input_size = X.shape[2]  # Read one-hot vocabulary size.
    rng = np.random.default_rng(3)  # Create reproducible local RNG.
    W_u = rng.normal(0.0, 0.40, (hidden_size, input_size))  # Initialize update input weights.
    U_u = rng.normal(0.0, 0.20, (hidden_size, hidden_size))  # Initialize update recurrent weights.
    W_r = rng.normal(0.0, 0.40, (hidden_size, input_size))  # Initialize reset input weights.
    U_r = rng.normal(0.0, 0.20, (hidden_size, hidden_size))  # Initialize reset recurrent weights.
    W_cx = rng.normal(0.0, 0.50, (hidden_size, input_size))  # Initialize candidate input weights.
    W_ch = rng.normal(0.0, 0.30, (hidden_size, hidden_size))  # Initialize candidate recurrent weights.
    states = np.zeros((X.shape[0], X.shape[1], hidden_size))  # Store GRU states.
    gates = {"update": np.zeros_like(states), "reset": np.zeros_like(states)}  # Store gate activations.
    for i in range(X.shape[0]):  # Process each sequence.
        h = np.zeros(hidden_size)  # Start with zero hidden state.
        for t in range(X.shape[1]):  # Process each token position.
            x_t = X[i, t]  # Read one-hot token.
            gamma_u = sigmoid(W_u @ x_t + U_u @ h - 0.2)  # Compute update gate.
            gamma_r = sigmoid(W_r @ x_t + U_r @ h)  # Compute reset gate.
            candidate = tanh(W_cx @ x_t + W_ch @ (gamma_r * h))  # Compute candidate hidden state.
            h = gamma_u * candidate + (1.0 - gamma_u) * h  # Blend candidate and old state.
            states[i, t] = h  # Save hidden state.
            gates["update"][i, t] = gamma_u  # Save update gate.
            gates["reset"][i, t] = gamma_r  # Save reset gate.
    return states, gates  # Return states and gates.


def lstm_forward(X, hidden_size=4):  # Run a deterministic LSTM feature extractor.
    input_size = X.shape[2]  # Read vocabulary size.
    rng = np.random.default_rng(4)  # Create reproducible local RNG.
    W = {k: rng.normal(0.0, 0.35, (hidden_size, input_size)) for k in ["f", "u", "r", "o", "c"]}  # Make input weights.
    U = {k: rng.normal(0.0, 0.20, (hidden_size, hidden_size)) for k in ["f", "u", "r", "o", "c"]}  # Make recurrent weights.
    states = np.zeros((X.shape[0], X.shape[1], hidden_size))  # Store hidden states.
    cells = np.zeros_like(states)  # Store cell states.
    gates = {"forget": np.zeros_like(states), "update": np.zeros_like(states), "reset": np.zeros_like(states), "output": np.zeros_like(states)}  # Store gates.
    for i in range(X.shape[0]):  # Process each sentence.
        h = np.zeros(hidden_size)  # Initialize hidden state.
        c = np.zeros(hidden_size)  # Initialize cell state.
        for t in range(X.shape[1]):  # Process each token.
            x_t = X[i, t]  # Read one-hot token.
            gamma_f = sigmoid(W["f"] @ x_t + U["f"] @ h + 1.0)  # Compute forget gate with open bias.
            gamma_u = sigmoid(W["u"] @ x_t + U["u"] @ h)  # Compute update gate.
            gamma_r = sigmoid(W["r"] @ x_t + U["r"] @ h)  # Compute relevance gate.
            gamma_o = sigmoid(W["o"] @ x_t + U["o"] @ h)  # Compute output gate.
            candidate = tanh(W["c"] @ x_t + U["c"] @ (gamma_r * h))  # Compute candidate cell.
            c = gamma_u * candidate + gamma_f * c  # Update cell state.
            h = gamma_o * c  # Expose hidden state.
            states[i, t] = h  # Save hidden state.
            cells[i, t] = c  # Save cell state.
            gates["forget"][i, t] = gamma_f  # Save forget gate.
            gates["update"][i, t] = gamma_u  # Save update gate.
            gates["reset"][i, t] = gamma_r  # Save reset gate.
            gates["output"][i, t] = gamma_o  # Save output gate.
    return states, cells, gates  # Return states, cells, and gates.

gru_states, gru_gates = gru_forward(sent_X)  # Compute GRU states and gates.
lstm_states, lstm_cells_small, lstm_gates_small = lstm_forward(sent_X)  # Compute LSTM states and gates.
sample = 0  # Choose one sentence to visualize.
plt.figure(figsize=(10, 4))  # Open a two-panel heatmap figure.
plt.subplot(1, 2, 1)  # Select GRU panel.
plt.imshow(gru_gates["update"][sample].T, aspect="auto", vmin=0, vmax=1, cmap="viridis")  # Show GRU update gates.
plt.colorbar(label="activation")  # Add activation colorbar.
plt.title("GRU update gate")  # Title GRU panel.
plt.xlabel("token position")  # Label token position.
plt.ylabel("hidden unit")  # Label hidden unit.
plt.subplot(1, 2, 2)  # Select LSTM panel.
plt.imshow(lstm_gates_small["forget"][sample].T, aspect="auto", vmin=0, vmax=1, cmap="viridis")  # Show LSTM forget gates.
plt.colorbar(label="activation")  # Add activation colorbar.
plt.title("LSTM forget gate")  # Title LSTM panel.
plt.xlabel("token position")  # Label token position.
plt.ylabel("hidden unit")  # Label hidden unit.
plt.tight_layout()  # Prevent overlap.
plt.show()  # Display heatmaps.
print("sample sentence", sent_sentences[sample])  # Print the sentence used for heatmaps.
```

▶ What you'll see: gate activations differ by hidden unit and token position, showing that gates are vector-valued learned valves.

👀 GRU uses fewer gates; LSTM separates forget, update, output, and cell memory.

#### A4. Character-level text generation

Goal: implement a character RNN sampling loop from scratch.

```python
def generate_text(seed_text="hello re", generated_length=60, temperature=0.8):  # Generate text with a deterministic random RNN.
    vocab_size = len(char_vocab)  # Read character vocabulary size.
    hidden_size = 12  # Choose a small hidden size for fast CPU execution.
    rng = np.random.default_rng(7)  # Create reproducible local RNG.
    W_ax = rng.normal(0.0, 0.35, (hidden_size, vocab_size))  # Initialize input-to-hidden weights.
    W_aa = rng.normal(0.0, 0.20, (hidden_size, hidden_size))  # Initialize recurrent weights.
    W_ya = rng.normal(0.0, 0.35, (vocab_size, hidden_size))  # Initialize hidden-to-output weights.
    b_a = np.zeros(hidden_size)  # Initialize hidden bias.
    b_y = np.zeros(vocab_size)  # Initialize output bias.
    h = np.zeros(hidden_size)  # Initialize hidden state.
    generated = list(seed_text)  # Start output with seed text.
    hidden_norms = []  # Store hidden-state norms.
    for ch in seed_text:  # Warm up hidden state with the seed.
        x = np.zeros(vocab_size)  # Allocate one-hot character vector.
        x[char_to_id.get(ch, 0)] = 1.0  # Encode seed character.
        h = tanh(W_ax @ x + W_aa @ h + b_a)  # Update hidden state.
        hidden_norms.append(np.linalg.norm(h))  # Store hidden norm.
    current_char = seed_text[-1]  # Feed the last seed character first.
    for step in range(generated_length):  # Generate requested number of characters.
        x = np.zeros(vocab_size)  # Allocate current character vector.
        x[char_to_id.get(current_char, 0)] = 1.0  # Encode current character.
        h = tanh(W_ax @ x + W_aa @ h + b_a)  # Update hidden state.
        logits = W_ya @ h + b_y  # Compute next-character logits.
        probs = softmax(logits / temperature)  # Convert logits to temperature-scaled probabilities.
        next_id = rng.choice(np.arange(vocab_size), p=probs)  # Sample next character id.
        current_char = char_vocab[next_id]  # Convert id back to character.
        generated.append(current_char)  # Append sampled character.
        hidden_norms.append(np.linalg.norm(h))  # Store hidden norm.
    return "".join(generated), np.array(hidden_norms)  # Return generated text and diagnostics.

cold_text, cold_norms = generate_text(temperature=0.4)  # Generate low-temperature text.
warm_text, warm_norms = generate_text(temperature=1.2)  # Generate high-temperature text.
plt.figure()  # Open a figure for hidden-state norms.
plt.plot(cold_norms, label="temperature 0.4")  # Plot cold hidden norm.
plt.plot(warm_norms, label="temperature 1.2")  # Plot warm hidden norm.
plt.title("A4: character RNN hidden activity")  # Title the plot.
plt.xlabel("generation step")  # Label generation step axis.
plt.ylabel("hidden-state norm")  # Label norm axis.
plt.legend()  # Show legend.
plt.tight_layout()  # Prevent clipping.
plt.show()  # Display plot.
print("temperature 0.4 sample:")  # Label first sample.
print(cold_text)  # Print low-temperature sample.
print("temperature 1.2 sample:")  # Label second sample.
print(warm_text)  # Print high-temperature sample.
```

▶ What you'll see: the loop encodes a character, updates hidden state, samples the next character, and feeds that sample back.

👀 The RNN is untrained, so text quality is not the point; the point is the complete generation mechanism.

#### A5. Bidirectional vs one-way sequence tagging

Goal: show why future context can help label ambiguous tokens.

```python
def one_way_rule_tagger(sentences):  # Define a tagger that only uses current and previous tokens.
    predictions = []  # Store one predicted tag sequence per sentence.
    for sentence in sentences:  # Process each tokenized sentence.
        row = []  # Store predictions for this sentence.
        for t, token in enumerate(sentence):  # Visit tokens from left to right.
            previous_token = sentence[t - 1] if t > 0 else "<START>"  # Read only past context.
            if token == "bank" and previous_token == "river":  # Use past context when river appears before bank.
                row.append("PLACE")  # Label river bank as a place.
            elif token == "bank":  # Handle bank when future context is unavailable.
                row.append("PLACE")  # Default to the common place sense without seeing the next word.
            elif token == "apple" and previous_token == "green":  # Use past context when green appears before apple.
                row.append("FRUIT")  # Label green apple as fruit.
            elif token == "apple":  # Handle apple when future context is unavailable.
                row.append("FRUIT")  # Default to the common fruit sense without seeing the next word.
            else:  # Handle non-ambiguous tokens.
                row.append("OTHER")  # Label all other tokens as non-entity in this toy corpus.
        predictions.append(row)  # Save the predicted sequence.
    return predictions  # Return all one-way predictions.


def bidirectional_rule_tagger(sentences):  # Define a tagger that uses both left and right context.
    predictions = []  # Store one predicted tag sequence per sentence.
    for sentence in sentences:  # Process each sentence.
        row = []  # Store predictions for this sentence.
        for t, token in enumerate(sentence):  # Visit each token position.
            previous_token = sentence[t - 1] if t > 0 else "<START>"  # Read left context.
            next_token = sentence[t + 1] if t + 1 < len(sentence) else "<END>"  # Read right context.
            if token == "bank" and next_token == "approves":  # Use future verb to identify financial institution.
                row.append("ORG")  # Label bank as an organization.
            elif token == "bank" and previous_token == "river":  # Use left context to identify river bank.
                row.append("PLACE")  # Label bank as a place.
            elif token == "apple" and next_token == "releases":  # Use future verb to identify company Apple.
                row.append("ORG")  # Label apple as an organization.
            elif token == "apple" and previous_token == "green":  # Use left context to identify fruit.
                row.append("FRUIT")  # Label apple as fruit.
            else:  # Handle tokens without entity meaning in this toy corpus.
                row.append("OTHER")  # Label all remaining tokens as other.
        predictions.append(row)  # Save the bidirectional prediction sequence.
    return predictions  # Return all bidirectional predictions.


def tag_accuracy(predictions, labels):  # Compute token-level accuracy for string labels.
    total = 0  # Count all tagged tokens.
    correct = 0  # Count correctly tagged tokens.
    for pred_row, true_row in zip(predictions, labels):  # Compare predicted and true sequences.
        for pred, true in zip(pred_row, true_row):  # Compare tags token by token.
            total += 1  # Increment denominator.
            correct += int(pred == true)  # Increment numerator when tags match.
    return correct / total  # Return token accuracy.

one_way_tags = one_way_rule_tagger(tag_sentences)  # Predict tags with left-to-right context only.
bi_tags = bidirectional_rule_tagger(tag_sentences)  # Predict tags with both past and future context.
one_way_acc = tag_accuracy(one_way_tags, tag_labels)  # Compute one-way token accuracy.
bi_acc = tag_accuracy(bi_tags, tag_labels)  # Compute bidirectional token accuracy.
plt.figure()  # Open a bar-chart figure.
plt.bar(["one-way", "bidirectional"], [one_way_acc, bi_acc], color=["gray", "black"])  # Plot token accuracies.
plt.ylim(0.0, 1.05)  # Use a full probability axis.
plt.title("A5: sequence tagging accuracy")  # Title bar chart.
plt.ylabel("token accuracy")  # Label accuracy axis.
plt.tight_layout()  # Prevent clipping.
plt.show()  # Display bar chart.
for sentence, true_row, one_row, bi_row in zip(tag_sentences, tag_labels, one_way_tags, bi_tags):  # Report every sentence.
    print(sentence, "true=", true_row, "one-way=", one_row, "bidirectional=", bi_row)  # Print comparison.
print("one-way accuracy", round(one_way_acc, 3))  # Print one-way accuracy.
print("bidirectional accuracy", round(bi_acc, 3))  # Print bidirectional accuracy.
```

▶ What you'll see: bidirectional features can use words on both sides of ambiguous tokens such as “bank” and “apple.”

👀 Use a one-way RNN for streaming prediction; use a bidirectional RNN when the whole sequence is available.

### Interactive Experiment

Change sequence length and forget-gate bias to see memory decay. The simplified retention model is

$$
c^{<t>}=\Gamma_fc^{<t-1>},\qquad \Gamma_f=\sigma(b_f),\qquad c^{<0>}=1.
$$

```python
try:  # Try to load widgets for notebook interactivity.
    from ipywidgets import interact, IntSlider, FloatSlider  # Import interactive slider tools.
except Exception:  # Fall back gracefully outside notebook environments.
    interact = None  # Mark widgets as unavailable.
    IntSlider = None  # Mark integer slider as unavailable.
    FloatSlider = None  # Mark float slider as unavailable.
    print("ipywidgets unavailable; drawing a static fallback plot.")  # Explain fallback behavior.


def plot_gate_memory(sequence_length=40, forget_bias=2.0):  # Define a plot function for sliders or fallback.
    gamma_f = float(sigmoid(forget_bias))  # Convert forget bias to gate activation.
    time = np.arange(sequence_length + 1)  # Include timestep zero through sequence length.
    memory = gamma_f ** time  # Compute retained memory fraction.
    plt.figure()  # Open a new figure.
    plt.plot(time, memory, marker="o", label=f"Gamma_f={gamma_f:.3f}")  # Plot memory retention curve.
    plt.axhline(0.5, color="black", linestyle="--", label="50% memory")  # Mark half-retention threshold.
    plt.title("Interactive: forget gate controls memory lifetime")  # Title experiment.
    plt.xlabel("timesteps after writing memory")  # Label horizontal axis.
    plt.ylabel("retained memory fraction")  # Label vertical axis.
    plt.ylim(-0.02, 1.05)  # Keep y-axis on probability scale.
    plt.legend()  # Show legend.
    plt.tight_layout()  # Prevent clipping.
    plt.show()  # Display plot.
    print(f"forget bias={forget_bias:.2f}, Gamma_f={gamma_f:.4f}, retained={memory[-1]:.4f}")  # Print exact values.

if interact is not None:  # Use widgets when available.
    interact(plot_gate_memory, sequence_length=IntSlider(value=40, min=5, max=100, step=5, description="length"), forget_bias=FloatSlider(value=2.0, min=-4.0, max=6.0, step=0.25, description="forget bias"))  # Create interactive controls.
else:  # Use static fallback when widgets are unavailable.
    plot_gate_memory(sequence_length=40, forget_bias=2.0)  # Draw one representative curve.
```

▶ What you'll see: larger forget bias makes $\Gamma_f$ closer to $1$, so retained memory decays much more slowly.

👀 A forget gate of $0.50$ halves memory every step; a forget gate near $0.98$ can keep memory for many timesteps.
