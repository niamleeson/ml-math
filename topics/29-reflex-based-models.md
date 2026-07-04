# Reflex-based Models: Predictors & Loss

> **Source:** Artificial Intelligence — Stanford CS 221 &middot; Topic 29/38 &middot; [↑ Full reference](../ai-ml-cheatsheets.md)

## 1 Reflex-based models

### 1.1 Linear predictors

In this section, we will go through reflex-based models that can improve with experience, by going through samples that have input-output pairs.

- **Feature vector** — The feature vector of an input $x$ is noted $\phi(x)$ and is such that:

$$
\phi(x)=\begin{bmatrix}
\phi_1(x)\\
\vdots\\
\phi_d(x)
\end{bmatrix}\in\mathbb{R}^d
$$

- **Score** — The score $s(x,w)$ of an example $(\phi(x),y)\in\mathbb{R}^d\times\mathbb{R}$ associated to a linear model of weights $w\in\mathbb{R}^d$ is given by the inner product:

$$
s(x,w)=w\cdot\phi(x)
$$

#### 1.1.1 Classification

- **Linear classifier** — Given a weight vector $w\in\mathbb{R}^d$ and a feature vector $\phi(x)\in\mathbb{R}^d$, the binary linear classifier $f_w$ is given by:

$$
f_w(x)=\operatorname{sign}(s(x,w))=
\begin{cases}
+1 & \text{if } w\cdot\phi(x)>0\\
-1 & \text{if } w\cdot\phi(x)<0\\
? & \text{if } w\cdot\phi(x)=0
\end{cases}
$$

*[Figure: A two-class scatter plot with blue points on the upper-left side and red points on the lower-right side separated by a diagonal decision boundary. The line is labeled $w\cdot\phi(x)=0$, with the blue side labeled $w\cdot\phi(x)>0$ and the red side labeled $w\cdot\phi(x)<0$, illustrating how a linear classifier separates classes.]*

- **Margin** — The margin $m(x,y,w)\in\mathbb{R}$ of an example $(\phi(x),y)\in\mathbb{R}^d\times\{-1,+1\}$ associated to a linear model of weights $w\in\mathbb{R}^d$ quantifies the confidence of the prediction: larger values are better. It is given by:

$$
m(x,y,w)=s(x,w)\times y
$$

#### 1.1.2 Regression

- **Linear regression** — Given a weight vector $w\in\mathbb{R}^d$ and a feature vector $\phi(x)\in\mathbb{R}^d$, the output of a linear regression of weights $w$ denoted as $f_w$ is given by:

$$
f_w(x)=s(x,w)
$$

- **Residual** — The residual $\operatorname{res}(x,y,w)\in\mathbb{R}$ is defined as being the amount by which the prediction $f_w(x)$ overshoots the target $y$:

$$
\operatorname{res}(x,y,w)=f_w(x)-y
$$

### 1.2 Loss minimization

- **Loss function** — A loss function $\operatorname{Loss}(x,y,w)$ quantifies how unhappy we are with the weights $w$ of the model in the prediction task of output $y$ from input $x$. It is a quantity we want to minimize during the training process.

- **Classification case** — The classification of a sample $x$ of true label $y\in\{-1,+1\}$ with a linear model of weights $w$ can be done with the predictor $f_w(x)\triangleq\operatorname{sign}(s(x,w))$. In this situation, a metric of interest quantifying the quality of the classification is given by the margin $m(x,y,w)$, and can be used with the following loss functions:

| Name | Zero-one loss | Hinge loss | Logistic loss |
|---|---|---|---|
| $\operatorname{Loss}(x,y,w)$ | $\mathbf{1}_{\{m(x,y,w)\leq 0\}}$ | $\max(1-m(x,y,w),0)$ | $\log(1+e^{-m(x,y,w)})$ |
| Illustration | *Plot of $\operatorname{Loss}_{0/1}$ versus $m(x,y,w)$: a step function equal to 1 for nonpositive margin and 0 after margin 0, with marks at 0 and 1.* | *Plot of $\operatorname{Loss}_{\text{hinge}}$ versus $m(x,y,w)$: a red line decreasing linearly to 0 at margin 1, then staying at 0; marks at 0 and 1 show the margin threshold.* | *Plot of $\operatorname{Loss}_{\text{logistic}}$ versus $m(x,y,w)$: an orange smooth decreasing convex curve approaching 0 as the margin grows; marks at 0 and 1 show reference margins.* |

- **Regression case** — The prediction of a sample $x$ of true label $y\in\mathbb{R}$ with a linear model of weights $w$ can be done with the predictor $f_w(x)\triangleq s(x,w)$. In this situation, a metric of interest quantifying the quality of the regression is given by the margin $\operatorname{res}(x,y,w)$ and can be used with the following loss functions:

| Name | Squared loss | Absolute deviation loss |
|---|---|---|
| $\operatorname{Loss}(x,y,w)$ | $(\operatorname{res}(x,y,w))^2$ | $|\operatorname{res}(x,y,w)|$ |
| Illustration | *Plot of $\operatorname{Loss}_{\text{squared}}$ versus $\operatorname{res}(x,y,w)$: a blue parabola with minimum 0 at residual 0.* | *Plot of $\operatorname{Loss}_{\text{absolute}}$ versus $\operatorname{res}(x,y,w)$: a pink V-shaped curve with minimum 0 at residual 0.* |

- **Loss minimization framework** — In order to train a model, we want to minimize the training loss is defined as follows:

$$
\operatorname{TrainLoss}(w)=\frac{1}{|\mathcal{D}_{\text{train}}|}\sum_{(x,y)\in\mathcal{D}_{\text{train}}}\operatorname{Loss}(x,y,w)
$$

### 1.3 Non-linear predictors

- **$k$-nearest neighbors** — The $k$-nearest neighbors algorithm, commonly known as $k$-NN, is a non-parametric approach where the response of a data point is determined by the nature of its $k$ neighbors from the training set. It can be used in both classification and regression settings.

*[Figure: Three side-by-side two-dimensional classification examples for $k$-NN with blue and red training points. The background decision regions are colored blue/red. Panels labeled $k=1$, $k=3$, and $k=11$ show that small $k$ produces a highly flexible boundary while larger $k$ produces a smoother, higher-bias boundary.]*

*Remark: the higher the parameter $k$, the higher the bias, and the lower the parameter $k$, the higher the variance.*

- **Neural networks** — Neural networks are a class of models that are built with layers. Commonly used types of neural networks include convolutional and recurrent neural networks. The vocabulary around neural networks architectures is described in the figure below:

*[Figure: A feed-forward neural network diagram with an input layer of green nodes, hidden layer 1 and subsequent hidden layers of blue nodes, an ellipsis indicating more layers up to hidden layer $k$, and an output layer of red nodes. Fully connected arrows run between consecutive layers, illustrating layered neural network architecture vocabulary.]*

By noting $i$ the $i^{\text{th}}$ layer of the network and $j$ the $j^{\text{th}}$ hidden unit of the layer, we have:

$$
z_j^{(i)}=w_j^{(i)T}x+b_j^{(i)}
$$

where we note $w,b,x,z$ the weight, bias, input and non-activated output of the neuron respectively.
