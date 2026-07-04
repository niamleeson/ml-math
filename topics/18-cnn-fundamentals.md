# CNN Fundamentals: Layers, Filters, Tuning

> **Source:** Deep Learning — Stanford CS 230 &middot; Topic 18/38 &middot; [↑ Full reference](../ai-ml-cheatsheets.md)

## 1 Convolutional Neural Networks

### 1.1 Overview

- **Architecture of a traditional CNN** — Convolutional neural networks, also known as CNNs, are a specific type of neural networks that are generally composed of the following layers:

*[Figure: Architecture of a traditional CNN. A teddy-bear input image passes through stacked convolution feature maps labeled "Convolutions," then smaller stacked maps labeled "Pooling," then a dense neural network labeled "Fully Connected." Connection lines show local receptive fields early and full connections at the end, illustrating the standard CNN pipeline from image to features to prediction.]*

The convolution layer and the pooling layer can be fine-tuned with respect to hyperparameters that are described in the next sections.

### 1.2 Types of layer

- **Convolutional layer (CONV)** — The convolution layer (CONV) uses filters that perform convolution operations as it is scanning the input $I$ with respect to its dimensions. Its hyperparameters include the filter size $F$ and stride $S$. The resulting output $O$ is called _feature map_ or _activation map_.

*[Figure: Convolution layer. A square filter window slides over a red-tinted input grid; dotted projection lines show the filter patch being combined to produce one blue output activation cell, and repeated scanning creates a purple output feature map. The figure illustrates local convolution and feature-map construction.]*

Remark: the convolution step can be generalized to the 1D and 3D cases as well.

- **Pooling (POOL)** — The pooling layer (POOL) is a downsampling operation, typically applied after a convolution layer, which does some spatial invariance. In particular, max and average pooling are special kinds of pooling where the maximum and average value is taken, respectively.

| Type | Max pooling | Average pooling |
|---|---|---|
| **Purpose** | Each pooling operation selects the maximum value of the current view | Each pooling operation averages the values of the current view |
| **Illustration** | *[Figure: Max pooling. A highlighted moving window over a feature-map grid labeled "max" produces a smaller output grid by retaining the maximum value in each viewed region.]* | *[Figure: Average pooling. A highlighted moving window over a feature-map grid labeled "avg" produces a smaller output grid by averaging each viewed region.]* |
| **Comments** | - Preserves detected features<br>- Most commonly used | - Downsamples feature map<br>- Used in LeNet |

- **Fully Connected (FC)** — The fully connected layer (FC) operates on a flattened input where each input is connected to all neurons. If present, FC layers are usually found towards the end of CNN architectures and can be used to optimize objectives such as class scores.

*[Figure: Fully connected layer. A small feature map is flattened into a vertical vector, then every vector entry is connected by dense edges to hidden neurons and output neurons, showing how CNN features feed a traditional multilayer neural network.]*

### 1.3 Filter hyperparameters

The convolution layer contains filters for which it is important to know the meaning behind its hyperparameters.

- **Dimensions of a filter** — A filter of size $F \times F$ applied to an input containing $C$ channels is a $F \times F \times C$ volume that performs convolutions on an input of size $I \times I \times C$ and produces an output feature map (also called activation map) of size $O \times O \times 1$.

*[Figure: Dimensions of filters. Two blue cuboid filters labeled Filter 1 and Filter 2 have spatial dimensions $F$ by $F$ and depth $C$, emphasizing that each filter spans all input channels.]*

Remark: the application of $K$ filters of size $F \times F$ results in an output feature map of size $O \times O \times K$.

- **Stride** — For a convolutional or a pooling operation, the stride $S$ denotes the number of pixels by which the window moves after each operation.

*[Figure: Stride. One-dimensional grid diagrams show a blue window moving horizontally by a labeled step $S$, illustrating that stride is the displacement between consecutive convolution or pooling windows.]*

- **Zero-padding** — Zero-padding denotes the process of adding $P$ zeroes to each side of the boundaries of the input. This value can either be manually specified or automatically set through one of the three modes detailed below:

| Mode | Valid | Same | Full |
|---|---|---|---|
| **Value** | $P = 0$ | $P_{\text{start}} = \left\lfloor \frac{S\left\lceil \frac{I}{S} \right\rceil - I + F - S}{2} \right\rfloor$<br>$P_{\text{end}} = \left\lceil \frac{S\left\lceil \frac{I}{S} \right\rceil - I + F - S}{2} \right\rceil$ | $P_{\text{start}} \in \llbracket 0, F - 1 \rrbracket$<br><br>$P_{\text{end}} = F - 1$ |
| **Illustration** | *[Figure: Valid padding. The filter is applied only inside the original input grid; no gray padded cells surround the input.]* | *[Figure: Same padding. Gray padded cells are added around the input so the feature-map size is mathematically convenient, with output length $\left\lceil I/S \right\rceil$.]* | *[Figure: Full padding. A larger gray padded border surrounds the input so filter placements can reach the input boundaries end-to-end.]* |
| **Purpose** | - No padding<br>- Drops last convolution if dimensions do not match | - Padding such that feature map size has size $\left\lceil \frac{I}{S} \right\rceil$<br>- Output size is mathematically convenient<br>- Also called 'half' padding | - Maximum padding such that end convolutions are applied on the limits of the input<br>- Filter 'sees' the input end-to-end |

### 1.4 Tuning hyperparameters

- **Parameter compatibility in convolution layer** — By noting $I$ the length of the input volume size, $F$ the length of the filter, $P$ the amount of zero padding, $S$ the stride, then the output size $O$ of the feature map along that dimension is given by:

$$
\boxed{O = \frac{I - F + P_{\text{start}} + P_{\text{end}}}{S} + 1}
$$

*[Figure: Parameter compatibility. A gridded teddy-bear input has labeled length $I$, padding labels $P_{\text{start}}$ and $P_{\text{end}}$, a square filter labeled $F \times F$, and an output grid labeled $O \times O$, illustrating how input size, filter size, padding, and stride determine the output dimension.]*

Remark: often times, $P_{\text{start}} = P_{\text{end}} \triangleq P$, in which case we can replace $P_{\text{start}} + P_{\text{end}}$ by $2P$ in the formula above.

- **Understanding the complexity of the model** — In order to assess the complexity of a model, it is often useful to determine the number of parameters that its architecture will have. In a given layer of a convolutional neural network, it is done as follows:

|  | CONV | POOL | FC |
|---|---|---|---|
| **Illustration** | *[Figure: CONV complexity illustration. A filter of size $F \times F$ spanning $C$ channels is repeated for $K$ filters.]* | *[Figure: POOL complexity illustration. A pooling window of size $F \times F$ applies a max operation without learned weights.]* | *[Figure: FC complexity illustration. $N_{\text{in}}$ input neurons are densely connected to $N_{\text{out}}$ output neurons.]* |
| **Input size** | $I \times I \times C$ | $I \times I \times C$ | $N_{\text{in}}$ |
| **Output size** | $O \times O \times K$ | $O \times O \times C$ | $N_{\text{out}}$ |
| **Number of parameters** | $(F \times F \times C + 1) \cdot K$ | $0$ | $(N_{\text{in}} + 1) \times N_{\text{out}}$ |
| **Remarks** | - One bias parameter per filter<br>- In most cases, $S < F$<br>- A common choice for $K$ is $2C$ | - Pooling operation done channel-wise<br>- In most cases, $S = F$ | - Input is flattened<br>- One bias parameter per neuron<br>- The number of FC neurons is free of structural constraints |

- **Receptive field** — The receptive field at layer $k$ is the area denoted $R_k \times R_k$ of the input that each pixel of the $k$-th activation map can 'see'. By calling $F_j$ the filter size of layer $j$ and $S_i$ the stride value of layer $i$ and with the convention $S_0 = 1$, the receptive field at layer $k$ can be computed with the formula:

$$
\boxed{R_k = 1 + \sum_{j=1}^{k} (F_j - 1) \prod_{i=0}^{j-1} S_i}
$$

In the example below, we have $F_1 = F_2 = 3$ and $S_1 = S_2 = 1$, which gives $R_2 = 1 + 2 \cdot 1 + 2 \cdot 1 = 5$.

*[Figure: Receptive field. A red input grid maps through two convolutional layers to purple and blue feature maps; dotted lines trace back from one later activation to a larger input patch, illustrating how stacked filters enlarge the area of the original input visible to a deep-layer pixel.]*
