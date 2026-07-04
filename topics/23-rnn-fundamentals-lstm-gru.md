# RNN Fundamentals & LSTM/GRU

> **Source:** Deep Learning — Stanford CS 230 &middot; Topic 23/38 &middot; [↑ Full reference](../ai-ml-cheatsheets.md)

## 2 Recurrent Neural Networks

### 2.1 Overview

- **Architecture of a traditional RNN** — Recurrent neural networks, also known as RNNs, are a class of neural networks that allow previous outputs to be used as inputs while having hidden states. They are typically as follows:

*[Figure: Traditional RNN architecture diagram in two equivalent views. The unrolled view shows a sequence beginning with $a^{<0>}$ and inputs $x^{<1>}$, $x^{<2>}$, $\ldots$, $x^{<t>}$, $x^{<t+1>}$ feeding blue recurrent cells; each cell outputs $y^{<1>}$, $y^{<2>}$, $\ldots$, $y^{<t>}$, $y^{<t+1>}$, and passes activations $a^{<1>}$, $a^{<2>}$, $\ldots$ forward. The cell view shows $a^{<t-1>}$ and $x^{<t>}$ combined through shared weights $W_{aa}$ and $W_{ax}$ with bias $b_a$, nonlinearity $g_1$, then mapped through $W_{ya}$, bias $b_y$, and $g_2$ to $y^{<t>}$; the purpose is to connect the compact equations to the computational graph.]*

For each timestep $t$, the activation $a^{<t>}$ and the output $y^{<t>}$ are expressed as follows:

$$
\boxed{a^{<t>}=g_1\left(W_{aa}a^{<t-1>}+W_{ax}x^{<t>}+b_a\right)}\quad\textrm{and}\quad\boxed{y^{<t>}=g_2\left(W_{ya}a^{<t>}+b_y\right)}
$$

where $W_{ax}, W_{aa}, W_{ya}, b_a, b_y$ are coefficients that are shared temporally and $g_1,g_2$ activation functions.

The pros and cons of a typical RNN architecture are summed up in the table below:

| Advantages | Drawbacks |
|---|---|
| - Possibility of processing input of any length<br>- Model size not increasing with size of input<br>- Computation takes into account historical information<br>- Weights are shared across time | - Computation being slow<br>- Difficulty of accessing information from a long time ago<br>- Cannot consider any future input for the current state |

- **Applications of RNNs** — RNN models are mostly used in the fields of natural language processing and speech recognition. The different applications are summed up in the table below:

| Type of RNN | Illustration | Example |
|---|---|---|
| One-to-one<br>$T_x=T_y=1$ | *[Figure: One-to-one RNN diagram with a single input $x$ and initial activation $a^{<0>}$ feeding one blue cell that outputs $\hat{y}$; it represents a traditional neural network with one input and one output.]* | Traditional neural network |
| One-to-many<br>$T_x=1,T_y>1$ | *[Figure: One-to-many RNN diagram with one input $x$ and initial activation $a^{<0>}$ feeding a chain of recurrent cells that emit $\hat{y}^{<1>}$, $\hat{y}^{<2>}$, $\ldots$, $\hat{y}^{<T_y>}$; feedback arrows indicate outputs or hidden states drive later generation.]* | Music generation |
| Many-to-one<br>$T_x>1,T_y=1$ | *[Figure: Many-to-one RNN diagram with sequence inputs $x^{<1>}$, $x^{<2>}$, $\ldots$, $x^{<T_x>}$ passing through recurrent cells from $a^{<0>}$ and producing a single final output $\hat{y}$.]* | Sentiment classification |
| Many-to-many<br>$T_x=T_y$ | *[Figure: Synchronous many-to-many RNN diagram with each input $x^{<1>}$, $x^{<2>}$, $\ldots$, $x^{<T_x>}$ aligned to an output $\hat{y}^{<1>}$, $\hat{y}^{<2>}$, $\ldots$, $\hat{y}^{<T_y>}$ at the same time step.]* | Name entity recognition |
| Many-to-many<br>$T_x\neq T_y$ | *[Figure: Encoder-decoder many-to-many RNN diagram with an input sequence processed first, followed by an output sequence generated later; input and output lengths differ, and a dashed separation indicates transition from encoding to decoding.]* | Machine translation |

- **Loss function** — In the case of a recurrent neural network, the loss function $\mathcal{L}$ of all time steps is defined based on the loss at every time step as follows:

$$
\boxed{\mathcal{L}(\widehat{y},y)=\sum_{t=1}^{T_y}\mathcal{L}\left(\widehat{y}^{<t>},y^{<t>}\right)}
$$

- **Backpropagation through time** — Backpropagation is done at each point in time. At timestep $T$, the derivative of the loss $\mathcal{L}$ with respect to weight matrix $W$ is expressed as follows:

$$
\boxed{\frac{\partial \mathcal{L}^{(T)}}{\partial W}=\sum_{t=1}^{T}\left.\frac{\partial \mathcal{L}^{(T)}}{\partial W}\right|_{(t)}}
$$

### 2.2 Handling long term dependencies

- **Commonly used activation functions** — The most common activation functions used in RNN modules are described below:

| Sigmoid | Tanh | RELU |
|---|---|---|
| $g(z)=\dfrac{1}{1+e^{-z}}$ | $g(z)=\dfrac{e^z-e^{-z}}{e^z+e^{-z}}$ | $g(z)=\max(0,z)$ |
| *[Figure: Sigmoid curve rising smoothly from near 0 to near 1, passing through $\frac{1}{2}$ at $z=0$, with horizontal scale roughly from $-4$ to $4$; it illustrates bounded gate activations.]* | *[Figure: Hyperbolic tangent curve rising from near $-1$ to near $1$ and crossing 0 at the origin, with horizontal scale roughly from $-4$ to $4$; it illustrates centered hidden-state activation.]* | *[Figure: ReLU plot equal to 0 for negative $z$ and a straight increasing line for positive $z$, with axes marked near 0 and 1; it illustrates rectified activation.]* |

- **Vanishing/exploding gradient** — The vanishing and exploding gradient phenomena are often encountered in the context of RNNs. The reason why they happen is that it is difficult to capture long term dependencies because of multiplicative gradient that can be exponentially decreasing/increasing with respect to the number of layers.

- **Gradient clipping** — It is a technique used to cope with the exploding gradient problem sometimes encountered when performing backpropagation. By capping the maximum value for the gradient, this phenomenon is controlled in practice.

*[Figure: Gradient clipping graph with horizontal axis $\|\nabla\mathcal{L}\|$ and vertical axis $\|\nabla\mathcal{L}\|_{\textrm{clipped}}$. The blue line increases linearly from 0 until threshold $C$ and then becomes flat at height $C$, illustrating that gradients larger than the cap are clipped.]*

- **Types of gates** — In order to remedy the vanishing gradient problem, specific gates are used in some types of RNNs and usually have a well-defined purpose. They are usually noted $\Gamma$ and are equal to:

$$
\boxed{\Gamma=\sigma\left(Wx^{<t>}+Ua^{<t-1>}+b\right)}
$$

where $W,U,b$ are coefficients specific to the gate and $\sigma$ is the sigmoid function. The main ones are summed up in the table below:

| Type of gate | Role | Used in |
|---|---|---|
| Update gate $\Gamma_u$ | How much past should matter now? | GRU, LSTM |
| Relevance gate $\Gamma_r$ | Drop previous information? | GRU, LSTM |
| Forget gate $\Gamma_f$ | Erase a cell or not? | LSTM |
| Output gate $\Gamma_o$ | How much to reveal of a cell? | LSTM |

- **GRU/LSTM** — Gated Recurrent Unit (GRU) and Long Short-Term Memory units (LSTM) deal with the vanishing gradient problem encountered by traditional RNNs, with LSTM being a generalization of GRU. Below is a table summing up the characterizing equations of each architecture:

|  | Gated Recurrent Unit (GRU) | Long Short-Term Memory (LSTM) |
|---|---|---|
| $\widetilde{c}^{<t>}$ | $\tanh\left(W_c[\Gamma_r * a^{<t-1>},x^{<t>}]+b_c\right)$ | $\tanh\left(W_c[\Gamma_r * a^{<t-1>},x^{<t>}]+b_c\right)$ |
| $c^{<t>}$ | $\Gamma_u * \widetilde{c}^{<t>}+(1-\Gamma_u)*c^{<t-1>}$ | $\Gamma_u * \widetilde{c}^{<t>}+\Gamma_f*c^{<t-1>}$ |
| $a^{<t>}$ | $c^{<t>}$ | $\Gamma_o*c^{<t>}$ |
| Dependencies | *[Figure: GRU cell dependency diagram showing previous cell/state $c^{<t-1>}$ and previous activation $a^{<t-1>}$ entering a blue recurrent block, current input $x^{<t>}$ entering from below, relevance gate $\Gamma_r$ and update gate $\Gamma_u$ controlling candidate $\widetilde{c}^{<t>}$ and the flow to $c^{<t>}$ and $a^{<t>}$.]* | *[Figure: LSTM cell dependency diagram showing separate memory $c^{<t-1>}\to c^{<t>}$ across the top, previous activation $a^{<t-1>}\to a^{<t>}$ across the lower path, current input $x^{<t>}$ from below, and gates $\Gamma_f$, $\Gamma_u$, $\Gamma_r$, and $\Gamma_o$ controlling forgetting, updating, candidate creation, and output exposure.]* |

_Remark: the sign $*$ denotes the element-wise multiplication between two vectors._

- **Variants of RNNs** — The table below sums up the other commonly used RNN architectures:

| Bidirectional (BRNN) | Deep (DRNN) |
|---|---|
| *[Figure: Bidirectional RNN illustration with forward hidden states moving left-to-right from $x^{<1>}$ to $x^{<T>}$ and backward hidden states moving right-to-left from an initial backward activation, both contributing upward to outputs $\hat{y}^{<1>}$, $\hat{y}^{<2>}$, $\ldots$, $\hat{y}^{<T>}$; the purpose is to use past and future context.]* | *[Figure: Deep RNN illustration with multiple stacked recurrent layers indexed by activations such as $a^{[1]<0>}$, $a^{[2]<0>}$, $a^{[k]<0>}$; each time step has vertical connections between layers and horizontal recurrent connections across time, producing outputs $\hat{y}^{<1>}$, $\hat{y}^{<2>}$, $\ldots$, $\hat{y}^{<t>}$; the purpose is to add depth to temporal modeling.]* |
