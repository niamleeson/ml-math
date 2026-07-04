# Deep Learning: Data Processing & Training

> **Source:** Deep Learning — Stanford CS 230 &middot; Topic 26/38 &middot; [↑ Full reference](../ai-ml-cheatsheets.md)

## 3 Deep Learning Tips and Tricks

### 3.1 Data processing

- **Data augmentation** — Deep learning models usually need a lot of data to be properly trained. It is often useful to get more data from the existing ones using data augmentation techniques. The main ones are summed up in the table below. More precisely, given the following input image, here are the techniques that we can apply:

| Original | Flip | Rotation | Random crop |
|---|---|---|---|
| *Teddy bear reading an open book, unchanged.* | *Same teddy-bear image flipped horizontally while preserving semantics.* | *Same teddy-bear image rotated by a slight angle, tilting the horizon.* | *Random close crop focusing on one part of the teddy-bear image.* |
| - Image without<br><br>any modification | - Flipped with respect<br>to an axis for which<br>the meaning of the<br>image is preserved | - Rotation with<br>a slight angle<br>- Simulates incorrect<br>horizon calibration | - Random focus<br>on one part of<br>the image<br>- Several random<br>crops can be<br>done in a row |

| Color shift | Noise addition | Information loss | Contrast change |
|---|---|---|---|
| *Teddy-bear image with RGB color nuances shifted to a warmer reddish tone.* | *Teddy-bear image with visible noise/grain added and lower quality appearance.* | *Teddy-bear image with black rectangles masking parts of the image.* | *Teddy-bear image with luminosity and contrast increased.* |
| - Nuances of RGB<br>is slightly changed<br>- Captures noise<br>that can occur<br>with light exposure | - Addition of noise<br>- More tolerance to<br>quality variation of<br>inputs | - Parts of image<br>ignored<br>- Mimics potential<br>loss of parts of image | - Luminosity changes<br>- Controls difference<br>in exposition due<br>to time of day |

- **Batch normalization** — It is a step of hyperparameter $\gamma,\beta$ that normalizes the batch $\{x_i\}$. By noting $\mu_B,\sigma_B^2$ the mean and variance of that we want to correct to the batch, it is done as follows:

$$
x_i \leftarrow \gamma\frac{x_i-\mu_B}{\sqrt{\sigma_B^2+\epsilon}}+\beta
$$

It is usually done after a fully connected/convolutional layer and before a non-linearity layer and aims at allowing higher learning rates and reducing the strong dependence on initialization.

### 3.2 Training a neural network

#### 3.2.1 Definitions

- **Epoch** — In the context of training a model, epoch is a term used to refer to one iteration where the model sees the whole training set to update its weights.

- **Mini-batch gradient descent** — During the training phase, updating weights is usually not based on the whole training set at once due to computation complexities or one data point due to noise issues. Instead, the update step is done on mini-batches, where the number of data points in a batch is a hyperparameter that we can tune.

- **Loss function** — In order to quantify how a given model performs, the loss function $L$ is usually used to evaluate to what extent the actual outputs $y$ are correctly predicted by the model outputs $z$.

- **Cross-entropy loss** — In the context of binary classification in neural networks, the cross-entropy loss $L(z,y)$ is commonly used and is defined as follows:

$$
L(z,y)=-\left[y\log(z)+(1-y)\log(1-z)\right]
$$

#### 3.2.2 Finding optimal weights

- **Backpropagation** — Backpropagation is a method to update the weights in the neural network by taking into account the actual output and the desired output. The derivative with respect to each weight $w$ is computed using the chain rule.

$$
\frac{\partial L}{\partial f(x)}\cdot\frac{\partial f(x)}{\partial x}
$$

*[Figure: Backpropagation chain-rule diagram with a central function node $f$, green forward arrow from input $x$ to output $f(x)$, and red backward arrow carrying gradients. The labels show $\frac{\partial L}{\partial f(x)}$ at the output side and $\frac{\partial L}{\partial f(x)}\cdot\frac{\partial f(x)}{\partial x}$ at the input side, illustrating how gradients are propagated backward through a function.]*

Using this method, each weight is updated with the rule:

$$
w \leftarrow w - \alpha\frac{\partial L(z,y)}{\partial w}
$$

- **Updating weights** — In a neural network, weights are updated as follows:

  - Step 1: Take a batch of training data and perform forward propagation to compute the loss.
  - Step 2: Backpropagate the loss to get the gradient of the loss with respect to each weight.
  - Step 3: Use the gradients to update the weights of the network.

*[Figure: Three-step neural-network training diagram. Step 1 shows forward propagation with a green arrow through layered neurons from inputs to outputs; Step 2 shows backpropagation with a red arrow flowing backward from outputs to inputs; Step 3 shows the weights update on the same network with a circular update arrow, summarizing the training loop.]*
