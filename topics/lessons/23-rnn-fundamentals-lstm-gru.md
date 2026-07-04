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

#### Setup

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
