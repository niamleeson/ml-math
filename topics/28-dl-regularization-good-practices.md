# DL Regularization & Good Practices

> **Source:** Deep Learning — Stanford CS 230 &middot; Topic 28/38 &middot; [↑ Full reference](../ai-ml-cheatsheets.md)

### 3.4 Regularization

- **Dropout** — Dropout is a technique used in neural networks to prevent overfitting the training data by dropping out neurons with probability $p>0$. It forces the model to avoid relying too much on particular sets of features.

*[Figure: Dropout neural-network diagram showing several layers of neurons, with some neurons greyed out/removed and others active. Connections pass only through active neurons to the output, illustrating random neuron dropout as a regularization method.]*

Remark: most deep learning frameworks parametrize dropout through the 'keep' parameter $1-p$.

- **Weight regularization** — In order to make sure that the weights are not too large and that the model is not overfitting the training set, regularization techniques are usually performed on the model weights. The main ones are summed up in the table below:

| LASSO | Ridge | Elastic Net |
|---|---|---|
| - Shrinks coefficients to 0<br>- Good for variable selection | Makes coefficients smaller | Tradeoff between variable<br>selection and small coefficients |
| *Contour plot with diamond-shaped $L_1$ constraint $\lVert\theta\rVert_1\leq 1$, red ellipses centered at $\theta^*$, and the optimum at a diamond corner to promote sparsity.* | *Contour plot with circular $L_2$ constraint $\lVert\theta\rVert_2^2\leq 1$, red ellipses centered at $\theta^*$, and the optimum on the circle to shrink coefficients.* | *Contour plot with elastic-net constraint $(1-\alpha)\lVert\theta\rVert_1+\alpha\lVert\theta\rVert_2^2\leq 1$, red ellipses centered at $\theta^*$, and the optimum on the combined constraint region.* |
| $...+\lambda\lVert\theta\rVert_1$<br>$\lambda\in\mathbb{R}$ | $...+\lambda\lVert\theta\rVert_2^2$<br>$\lambda\in\mathbb{R}$ | $...+\lambda\left[(1-\alpha)\lVert\theta\rVert_1+\alpha\lVert\theta\rVert_2^2\right]$<br>$\lambda\in\mathbb{R}, \alpha\in[0,1]$ |

- **Early stopping** — This regularization technique stops the training process as soon as the validation loss reaches a plateau or starts to increase.

*[Figure: Early stopping plot with y-axis labeled Error and x-axis labeled Epochs. Red Training error decreases monotonically, while blue Validation error decreases then rises; a black X and dashed vertical line mark the early stopping point near the validation minimum/plateau. The purpose is to stop training before validation error worsens.]*

### 3.5 Good practices

- **Overfitting small batch** — When debugging a model, it is often useful to make quick tests to see if there is any major issue with the architecture of the model itself. In particular, in order to make sure that the model can be properly trained, a mini-batch is passed inside the network to see if it can overfit on it. If it cannot, it means that the model is either too complex or not complex enough to even overfit on a small batch, let alone a normal-sized training set.

- **Gradient checking** — Gradient checking is a method used during the implementation of the backward pass of a neural network. It compares the value of the analytical gradient to the numerical gradient at given points and plays the role of a sanity-check for correctness.

|  | Numerical gradient | Analytical gradient |
|---|---|---|
| **Formula** | $\frac{df}{dx}(x)\approx\frac{f(x+h)-f(x-h)}{2h}$ | $\frac{df}{dx}(x)=f'(x)$ |
| **Comments** | - Expensive; loss has to be<br>computed two times per dimension<br>- Used to verify correctness<br>of analytical implementation<br>- Trade-off in choosing $h$<br>not too small (numerical instability)<br>nor too large (poor gradient approx.) | - 'Exact' result<br><br>- Direct computation<br><br>- Used in the final implementation |

* * *
