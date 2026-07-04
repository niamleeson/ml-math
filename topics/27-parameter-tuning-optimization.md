# Parameter Tuning & Optimization

> **Source:** Deep Learning — Stanford CS 230 &middot; Topic 27/38 &middot; [↑ Full reference](../ai-ml-cheatsheets.md)

### 3.3 Parameter tuning

#### 3.3.1 Weights initialization

- **Xavier initialization** — Instead of initializing the weights in a purely random manner, Xavier initialization enables to have initial weights that take into account characteristics that are unique to the architecture.

- **Transfer learning** — Training a deep learning model requires a lot of data and more importantly a lot of time. It is often useful to take advantage of pre-trained weights on huge datasets that took days/weeks to train, and leverage it towards our use case. Depending on how much data we have at hand, here are the different ways to leverage this:

| Training size | Illustration | Explanation |
|---|---|---|
| Small | *Neural network in which almost all hidden layers are frozen/greyed, and only the final softmax/output connections are highlighted for training.* | Freezes all layers,<br>trains weights on softmax |
| Medium | *Neural network in which most early layers are frozen/greyed, while the last layers and output softmax are highlighted for training.* | Freezes most layers,<br>trains weights on last<br>layers and softmax |
| Large | *Neural network in which all layers and the output softmax are highlighted for training, initialized from pre-trained weights.* | Trains weights on layers<br>and softmax by initializing<br>weights on pre-trained ones |

#### 3.3.2 Optimizing convergence

- **Learning rate** — The learning rate, often noted $\alpha$ or sometimes $\eta$, indicates at which pace the weights get updated. It can be fixed or adaptively changed. The current most popular method is called Adam, which is a method that adapts the learning rate.

- **Adaptive learning rates** — Letting the learning rate vary when training a model can reduce the training time and improve the numerical optimal solution. While Adam optimizer is the most commonly used technique, others can also be useful. They are summed up in the table below:

| Method | Explanation | Update of $w$ | Update of $b$ |
|---|---|---|---|
| Momentum | - Dampens oscillations<br>- Improvement to SGD<br>- 2 parameters to tune | $w-\alpha v_{dw}$ | $b-\alpha v_{db}$ |
| RMSprop | - Root Mean Square propagation<br>- Speeds up learning algorithm<br>by controlling oscillations | $w-\alpha\frac{dw}{\sqrt{s_{dw}}}$ | $b\leftarrow b-\alpha\frac{db}{\sqrt{s_{db}}}$ |
| Adam | - Adaptive Moment estimation<br>- Most popular method<br>- 4 parameters to tune | $w-\alpha\frac{v_{dw}}{\sqrt{s_{dw}}+\epsilon}$ | $b\leftarrow b-\alpha\frac{v_{db}}{\sqrt{s_{db}}+\epsilon}$ |

Remark: other methods include Adadelta, Adagrad and SGD.
