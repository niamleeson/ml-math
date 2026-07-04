# CNN Fundamentals: Layers, Filters, Tuning
> **Source:** CS 230 · **Category:** Model/Concept · **Type:** ⚖️ Both · [↑ Full reference](../../ai-ml-cheatsheets.md)
> 📓 The coded examples form a runnable notebook section; an .ipynb will be generated.

## 1. Overview

Convolutional neural networks (CNNs) are neural networks designed for grid-structured data such as images. Instead of connecting every input pixel to every hidden unit immediately, a CNN scans small learned filters across the input, preserves spatial layout in feature maps, downsamples with pooling, and finally uses fully connected layers to turn extracted evidence into predictions.

**One-line intuition:** a CNN learns small local detectors first, then reuses the same detector everywhere in the image and composes local detections into larger visual evidence.

Why this matters:

- Images have **local structure**: nearby pixels are more strongly related than far-apart pixels.
- Images have **repeated patterns**: an edge detector can be useful at the top-left, center, or bottom-right.
- Fully connected image models waste parameters because they ignore both locality and weight sharing.
- CNNs reduce parameter count while keeping the geometry needed for visual reasoning.

A traditional CNN pipeline is

$$
\text{input image}\ \longrightarrow\ \text{CONV}\ \longrightarrow\ \text{activation}\ \longrightarrow\ \text{POOL}\ \longrightarrow\ \text{flatten}\ \longrightarrow\ \text{FC}\ \longrightarrow\ \text{scores}.
$$

This lesson builds that pipeline from first principles: by hand on tiny arrays, then with runnable NumPy code that implements convolution and pooling without a deep-learning framework.

## 2. Key Idea

### 2.1 The convolution operation

Let a grayscale input image be a matrix $X\in\mathbb{R}^{I\times I}$ and let a square filter be $W\in\mathbb{R}^{F\times F}$. At output location $(u,v)$, the filter is placed over a local image patch and the output is the elementwise product sum:

$$
Y_{u,v}=\sum_{a=0}^{F-1}\sum_{b=0}^{F-1}X_{uS+a-P,\ vS+b-P}\,W_{a,b}+b_0,
$$

where:

- $F$ is the filter size,
- $S$ is the stride,
- $P$ is the amount of zero-padding on each side when symmetric padding is used,
- $b_0$ is one scalar bias for that filter.

For a multi-channel input $X\in\mathbb{R}^{I\times I\times C}$, one filter spans all channels:

$$
W\in\mathbb{R}^{F\times F\times C}.
$$

The convolution output for one filter is

$$
Y_{u,v}=\sum_{a=0}^{F-1}\sum_{b=0}^{F-1}\sum_{c=0}^{C-1}X_{uS+a-P,\ vS+b-P,\ c}\,W_{a,b,c}+b_0.
$$

With $K$ filters, the output has $K$ channels:

$$
X_{\text{out}}\in\mathbb{R}^{O\times O\times K}.
$$

This output is called a **feature map** or **activation map**.

### 2.2 Filters, stride, and padding

A filter is a local pattern detector. For example, a vertical-edge filter assigns positive weights to one side of a patch and negative weights to the other side, so its dot product is large when the patch changes sharply from left to right.

The stride $S$ controls how far the filter moves between neighboring output cells:

$$
\text{next horizontal window starts }S\text{ pixels to the right}.
$$

The padding $P$ controls how many zeros are added around the boundary. Padding changes whether edge pixels are used as often as central pixels.

Common padding modes:

- **Valid padding:** $P=0$. The filter is applied only where it fully fits inside the original input.
- **Same padding:** padding is chosen so the output size is convenient, often $O=I$ when $S=1$ and $F$ is odd.
- **Full padding:** enough padding is added so the filter can overlap every boundary position end-to-end.

### 2.3 Output-size formula

Assume one spatial dimension of length $I$, filter size $F$, stride $S$, and possibly asymmetric padding $P_{\text{start}}$ and $P_{\text{end}}$. After padding, the effective input length is

$$
I_{\text{eff}}=I+P_{\text{start}}+P_{\text{end}}.
$$

The first filter start index is $0$. The last legal start index is the largest start $t$ such that the filter still fits:

$$
t+F\le I_{\text{eff}}.
$$

Therefore

$$
t\le I_{\text{eff}}-F.
$$

Stride $S$ means legal starts are

$$
0,\ S,\ 2S,\ldots,(O-1)S.
$$

The final start is

$$
(O-1)S=I_{\text{eff}}-F.
$$

Solving for $O$ gives

$$
\begin{aligned}
(O-1)S &= I_{\text{eff}}-F \\
O-1 &= \frac{I_{\text{eff}}-F}{S} \\
O &= \frac{I_{\text{eff}}-F}{S}+1 \\
O &= \frac{I-F+P_{\text{start}}+P_{\text{end}}}{S}+1.
\end{aligned}
$$

So the CS 230 output-size formula is

$$
\boxed{O=\frac{I-F+P_{\text{start}}+P_{\text{end}}}{S}+1}.
$$

When padding is symmetric, $P_{\text{start}}=P_{\text{end}}=P$, so

$$
\boxed{O=\frac{I-F+2P}{S}+1}.
$$

A convolution or pooling setup is **compatible** only when $O$ is an integer. If $O$ is not an integer, the sliding windows do not land exactly on the last valid position.

### 2.4 Pooling

Pooling is a downsampling operation applied channel-wise. For a patch $A\in\mathbb{R}^{F\times F}$:

- Max pooling returns

$$
\operatorname{maxpool}(A)=\max_{i,j}A_{i,j}.
$$

- Average pooling returns

$$
\operatorname{avgpool}(A)=\frac{1}{F^2}\sum_{i=1}^{F}\sum_{j=1}^{F}A_{i,j}.
$$

Pooling has no learned weights. It reduces spatial size, often makes representations slightly more tolerant to small translations, and decreases later computation.

### 2.5 Fully connected layer after flattening

After several convolution and pooling stages, a feature tensor of shape

$$
H\times W\times C
$$

is flattened into a vector of length

$$
N_{\text{in}}=HWC.
$$

A fully connected layer with $N_{\text{out}}$ neurons computes

$$
z=W^{\top}x+b,
$$

where

$$
W\in\mathbb{R}^{N_{\text{in}}\times N_{\text{out}}},\qquad b\in\mathbb{R}^{N_{\text{out}}}.
$$

### 2.6 Parameter counting

For a convolutional layer with filter size $F\times F$, input channels $C$, and $K$ filters:

- one filter has $F\cdot F\cdot C$ weights,
- one filter has $1$ bias,
- $K$ filters repeat that parameter set.

Thus

$$
\boxed{\#\text{CONV params}=(F\times F\times C+1)\cdot K}.
$$

For pooling:

$$
\boxed{\#\text{POOL params}=0}.
$$

For a fully connected layer:

- each of $N_{\text{out}}$ output neurons has $N_{\text{in}}$ incoming weights,
- each output neuron has one bias.

Thus

$$
\boxed{\#\text{FC params}=(N_{\text{in}}+1)N_{\text{out}}}.
$$

These formulas explain why CNNs are efficient: a $3\times3$ filter over $3$ channels has only $27$ weights before bias, and those same weights are reused across all spatial positions.

### 2.7 Receptive field

The receptive field is the area of the original input that can influence one deep activation. For layer $k$, with filter size $F_j$ at layer $j$ and stride $S_i$ at layer $i$, using the convention $S_0=1$:

$$
\boxed{R_k=1+\sum_{j=1}^{k}(F_j-1)\prod_{i=0}^{j-1}S_i}.
$$

The formula says: each new layer adds $(F_j-1)$ new pixels, but that addition is magnified by the strides of all previous layers.

## 3. Worked Examples

### Setup

Run this once before the coded examples. It imports only CPU-friendly libraries, fixes randomness, and defines reusable convolution, pooling, and plotting helpers.

```python
import numpy as np  # Import NumPy for arrays, numerical operations, and reproducible random data.
import matplotlib.pyplot as plt  # Import Matplotlib for visualizing images, filters, feature maps, and curves.

np.random.seed(230)  # Fix the random seed so every run produces the same synthetic images and weights.

plt.rcParams["figure.figsize"] = (5, 4)  # Set a compact default figure size for notebook readability.
plt.rcParams["image.cmap"] = "gray"  # Use grayscale by default because the lesson focuses on image structure.
plt.rcParams["axes.grid"] = False  # Disable plot grids because image pixels should not be visually cluttered.


def output_size(I, F, S=1, P=0):  # Define the CS 230 output-size formula for symmetric padding.
    numerator = I - F + 2 * P  # Compute the total distance available for legal filter starts.
    O_float = numerator / S + 1  # Compute the formula value before checking integer compatibility.
    O_int = int(O_float) if float(O_float).is_integer() else None  # Return an integer only when windows land exactly.
    return O_float, O_int  # Return both the raw formula value and the compatible integer size.


def pad2d(x, P):  # Define zero-padding for a two-dimensional image.
    return np.pad(x, ((P, P), (P, P)), mode="constant", constant_values=0.0)  # Add P zeros to all four sides.


def conv2d_single(image, kernel, stride=1, padding=0, bias=0.0):  # Define one-filter 2-D convolution from scratch.
    padded = pad2d(image, padding)  # Pad the image so boundary behavior is controlled explicitly.
    F = kernel.shape[0]  # Read the square kernel size from the first dimension.
    H = padded.shape[0]  # Read the padded image height.
    W = padded.shape[1]  # Read the padded image width.
    out_h = (H - F) // stride + 1  # Compute the number of vertical filter positions.
    out_w = (W - F) // stride + 1  # Compute the number of horizontal filter positions.
    output = np.zeros((out_h, out_w), dtype=float)  # Allocate the feature map before filling it cell by cell.
    for i in range(out_h):  # Loop over output rows so each row corresponds to one vertical window start.
        for j in range(out_w):  # Loop over output columns so each column corresponds to one horizontal window start.
            row = i * stride  # Convert the output row index into the input window's top row.
            col = j * stride  # Convert the output column index into the input window's left column.
            patch = padded[row:row + F, col:col + F]  # Slice the exact receptive field seen by the kernel.
            output[i, j] = np.sum(patch * kernel) + bias  # Store the dot product plus the filter bias.
    return output  # Return the completed feature map.


def conv2d_multi_filter(image, kernels, stride=1, padding=0, biases=None):  # Define a bank of filters for one image.
    biases = np.zeros(len(kernels)) if biases is None else np.asarray(biases)  # Use zero bias unless explicit biases are passed.
    maps = [conv2d_single(image, kernel, stride=stride, padding=padding, bias=biases[k]) for k, kernel in enumerate(kernels)]  # Apply each filter independently.
    return np.stack(maps, axis=-1)  # Stack feature maps into an H by W by K activation tensor.


def max_pool2d(feature_map, pool_size=2, stride=2):  # Define max pooling from scratch for a single feature map.
    H = feature_map.shape[0]  # Read the input feature-map height.
    W = feature_map.shape[1]  # Read the input feature-map width.
    out_h = (H - pool_size) // stride + 1  # Compute the number of vertical pooling windows.
    out_w = (W - pool_size) // stride + 1  # Compute the number of horizontal pooling windows.
    pooled = np.zeros((out_h, out_w), dtype=float)  # Allocate the downsampled feature map.
    for i in range(out_h):  # Loop over pooled rows.
        for j in range(out_w):  # Loop over pooled columns.
            row = i * stride  # Convert pooled row to input patch start.
            col = j * stride  # Convert pooled column to input patch start.
            patch = feature_map[row:row + pool_size, col:col + pool_size]  # Select the pooling region.
            pooled[i, j] = np.max(patch)  # Keep the strongest activation in the region.
    return pooled  # Return the pooled feature map.


def avg_pool2d(feature_map, pool_size=2, stride=2):  # Define average pooling from scratch for comparison.
    H = feature_map.shape[0]  # Read the input feature-map height.
    W = feature_map.shape[1]  # Read the input feature-map width.
    out_h = (H - pool_size) // stride + 1  # Compute the number of vertical pooling windows.
    out_w = (W - pool_size) // stride + 1  # Compute the number of horizontal pooling windows.
    pooled = np.zeros((out_h, out_w), dtype=float)  # Allocate the downsampled feature map.
    for i in range(out_h):  # Loop over pooled rows.
        for j in range(out_w):  # Loop over pooled columns.
            row = i * stride  # Convert pooled row to input patch start.
            col = j * stride  # Convert pooled column to input patch start.
            patch = feature_map[row:row + pool_size, col:col + pool_size]  # Select the pooling region.
            pooled[i, j] = np.mean(patch)  # Average all activations in the region.
    return pooled  # Return the pooled feature map.


def relu(x):  # Define the standard CNN nonlinearity.
    return np.maximum(0.0, x)  # Keep positive evidence and suppress negative responses.


def normalize_image(x):  # Define min-max normalization for stable visual display.
    x = np.asarray(x, dtype=float)  # Convert the input to a floating-point NumPy array.
    lo = np.min(x)  # Find the smallest pixel value.
    hi = np.max(x)  # Find the largest pixel value.
    return (x - lo) / (hi - lo + 1e-12)  # Scale values to [0, 1] while avoiding division by zero.


def show_image(ax, image, title):  # Define a small helper for consistent image panels.
    ax.imshow(image, cmap="gray")  # Draw the image as a grayscale heatmap.
    ax.set_title(title)  # Add a concise panel title.
    ax.set_xticks([])  # Hide x-axis ticks so the viewer focuses on structure.
    ax.set_yticks([])  # Hide y-axis ticks so the viewer focuses on structure.
```

### Data — swappable sources

The coded examples use small synthetic image sources so the notebook runs without internet. Change `DATA_SOURCE` to see how the same filters behave on different image families.

```python
DATA_SOURCE = "shapes"  # Choose "shapes", "stripes", "checker", or "noisy_square" as the active image source.


def make_shapes_image(size=32):  # Create a simple image with a square, diagonal, and bright dot.
    img = np.zeros((size, size), dtype=float)  # Start from a black canvas.
    img[6:22, 8:24] = 0.45  # Add a medium-gray rectangle to create vertical and horizontal edges.
    np.fill_diagonal(img[4:28, 4:28], 1.0)  # Add a bright diagonal line to create angled structure.
    img[23:28, 23:28] = 0.9  # Add a bright block near the lower-right corner.
    return img  # Return the synthetic image.


def make_stripes_image(size=32):  # Create an image where vertical filters should respond strongly.
    img = np.zeros((size, size), dtype=float)  # Start from a black canvas.
    img[:, 4::8] = 1.0  # Add regularly spaced bright vertical stripes.
    img[:, 5::8] = 0.8  # Widen each stripe slightly for visible thickness.
    return img  # Return the striped image.


def make_checker_image(size=32):  # Create a high-frequency checkerboard source that stresses filters.
    rows = np.arange(size)[:, None]  # Create row indices as a column vector.
    cols = np.arange(size)[None, :]  # Create column indices as a row vector.
    img = ((rows // 4 + cols // 4) % 2).astype(float)  # Alternate dark and bright 4-by-4 blocks.
    return img  # Return the checkerboard image.


def make_noisy_square_image(size=32):  # Create a square image with noise as a mild failure/stress case.
    img = make_shapes_image(size)  # Reuse the structured shapes source as the signal.
    noise = 0.25 * np.random.randn(size, size)  # Generate Gaussian noise that can hide weak edges.
    return normalize_image(img + noise)  # Add noise and rescale to a valid display range.


def get_image(source=DATA_SOURCE, size=32):  # Centralize the data-source switch for all coded examples.
    if source == "shapes":  # Select the geometric shapes source.
        return make_shapes_image(size)  # Return the shapes image.
    if source == "stripes":  # Select the vertical stripe source.
        return make_stripes_image(size)  # Return the stripes image.
    if source == "checker":  # Select the checkerboard source.
        return make_checker_image(size)  # Return the checkerboard image.
    if source == "noisy_square":  # Select the noisy source that makes edges less clean.
        return make_noisy_square_image(size)  # Return the noisy image.
    raise ValueError("Unknown DATA_SOURCE; choose shapes, stripes, checker, or noisy_square.")  # Fail clearly for typos.

base_image = get_image(DATA_SOURCE, size=32)  # Build the active image once so examples share the same input.

fig, ax = plt.subplots(1, 1, figsize=(4, 4))  # Create one figure panel for the active source.
show_image(ax, base_image, f"DATA_SOURCE = {DATA_SOURCE}")  # Display the selected synthetic image.
plt.show()  # Render the figure in the notebook.
```

▶ What you'll see: a 32×32 grayscale image. The default `shapes` source has a rectangle, diagonal, and bright square; filters will respond at their boundaries.

👀 Look for sharp changes in intensity. Those are the locations where edge filters should produce strong positive or negative activations.

### 🟢 Basics (warm-up)

#### B1. Multiply one 2×2 image patch by one 2×2 filter

Goal: compute a single convolution dot product before sliding anything.

Let

$$
X_{\text{patch}}=
\begin{bmatrix}
1 & 2\\
3 & 4
\end{bmatrix},
\qquad
W=
\begin{bmatrix}
1 & 0\\
-1 & 2
\end{bmatrix}.
$$

The convolution output for this one location is the elementwise product sum:

$$
\begin{aligned}
X_{\text{patch}}\cdot W
&=(1)(1)+(2)(0)+(3)(-1)+(4)(2)\\
&=1+0-3+8\\
&=6.
\end{aligned}
$$

If the filter bias is $b_0=0$, then

$$
\boxed{Y=6}.
$$

If the bias were $b_0=-2$, then

$$
Y=6+(-2)=\boxed{4}.
$$

Interpretation: one convolution cell is just a weighted sum over one local patch.

```python
patch_b1 = np.array([[1, 2], [3, 4]])  # Store the same 2-by-2 image patch from the derivation.
kernel_b1 = np.array([[1, 0], [-1, 2]])  # Store the same 2-by-2 filter from the derivation.
products_b1 = patch_b1 * kernel_b1  # Multiply the patch and filter element by element.
conv_b1 = np.sum(products_b1)  # Sum the elementwise products to get the no-bias convolution value.
bias_b1 = -2  # Store the optional bias used in the second hand calculation.
biased_conv_b1 = conv_b1 + bias_b1  # Add the bias to reproduce the biased result.
print("conv output:", conv_b1)  # Print 6, matching the boxed no-bias answer.
print("biased conv output:", biased_conv_b1)  # Print 4, matching the boxed biased answer.
```

▶ What you'll see: the no-bias output is 6 and the biased output is 4.

👀 Takeaway: convolution is elementwise multiply, sum, then optional bias.

#### B2. Compute one convolution output size

Goal: use the output-size formula on the smallest complete scalar case.

Given

$$
I=5,\qquad F=3,\qquad S=1,\qquad P=0,
$$

use

$$
O=\frac{I-F+2P}{S}+1.
$$

Substitute every value:

$$
\begin{aligned}
O
&=\frac{5-3+2(0)}{1}+1\\
&=\frac{2}{1}+1\\
&=2+1\\
&=3.
\end{aligned}
$$

Therefore a $5\times5$ input convolved with a $3\times3$ filter, stride $1$, valid padding, produces

$$
\boxed{3\times3}\text{ output cells.}
$$

Interpretation: the output size counts legal filter placements, not pixels directly.

```python
input_size_b2 = 5  # Store the input height and width I from the derivation.
filter_size_b2 = 3  # Store the filter size F from the derivation.
stride_b2 = 1  # Store the stride S from the derivation.
padding_b2 = 0  # Store the symmetric padding P from the derivation.
output_size_b2 = (input_size_b2 - filter_size_b2 + 2 * padding_b2) // stride_b2 + 1  # Apply the output-size formula.
output_shape_b2 = (output_size_b2, output_size_b2)  # Convert the scalar output size into a square spatial shape.
print("output shape:", output_shape_b2)  # Print (3, 3), matching the boxed output cells.
```

▶ What you'll see: the valid convolution produces a 3-by-3 output grid.

👀 Takeaway: the formula counts where a full filter can land.

#### B3. Take one 2×2 max-pool value

Goal: compute one pooling output cell.

Let the activation patch be

$$
A=
\begin{bmatrix}
-1 & 5\\
2 & 3
\end{bmatrix}.
$$

Max pooling returns the largest activation in the patch:

$$
\begin{aligned}
\operatorname{maxpool}(A)
&=\max\{-1,5,2,3\}\\
&=5.
\end{aligned}
$$

So the pooled output cell is

$$
\boxed{5}.
$$

Average pooling would instead give

$$
\begin{aligned}
\operatorname{avgpool}(A)
&=\frac{-1+5+2+3}{4}\\
&=\frac{9}{4}\\
&=2.25.
\end{aligned}
$$

Interpretation: pooling summarizes a local region without learning new parameters.

```python
activation_patch_b3 = np.array([[-1, 5], [2, 3]])  # Store the same activation patch from the derivation.
max_pool_b3 = np.max(activation_patch_b3)  # Take the largest value in the patch.
avg_pool_b3 = np.mean(activation_patch_b3)  # Also compute the comparison average from the derivation.
print("max-pool value:", max_pool_b3)  # Print 5, matching the boxed max-pool answer.
print("average-pool comparison:", avg_pool_b3)  # Print 2.25, matching the handwritten comparison.
```

▶ What you'll see: max pooling returns 5 while average pooling would return 2.25.

👀 Takeaway: max pooling keeps the strongest local activation.

#### B4. Take one 2×2 average-pool value

Goal: compute the average pooling value for one local patch.

Let

$$
A=
\begin{bmatrix}
2 & 4\\
6 & 8
\end{bmatrix}.
$$

Average pooling returns the arithmetic mean:

$$
\operatorname{avgpool}(A)=\frac{2+4+6+8}{4}=\frac{20}{4}=5.
$$

So the pooled output cell is

$$
\boxed{5}.
$$

Interpretation: average pooling keeps the local average response, not the strongest response.

```python
activation_patch_b4 = np.array([[2, 4], [6, 8]])  # Store the same activation patch from the derivation.
sum_b4 = np.sum(activation_patch_b4)  # Add all four patch values to reproduce the numerator 20.
count_b4 = activation_patch_b4.size  # Count the four entries in the 2-by-2 patch.
avg_pool_b4 = sum_b4 / count_b4  # Divide the sum by the count to compute the average-pool value.
print("average-pool value:", avg_pool_b4)  # Print 5.0, matching the boxed answer.
```

▶ What you'll see: the average-pool value is 5.0.

👀 Takeaway: average pooling preserves the local mean signal.

#### B5. Count parameters in one convolution layer

Goal: use the convolution parameter-count formula once.

For filters of size $3\times3$, input channels $C=2$, and $K=4$ filters,

$$
\#\text{params}=(F\cdot F\cdot C+1)\cdot K.
$$

Substitute the values:

$$
(3\cdot3\cdot2+1)\cdot4=(18+1)\cdot4=76.
$$

The $+1$ is one bias per filter, so

$$
\boxed{76\text{ parameters}.}
$$

Interpretation: each filter spans every input channel and has its own bias.

```python
filter_height_b5 = 3  # Store the filter height from the derivation.
filter_width_b5 = 3  # Store the filter width from the derivation.
input_channels_b5 = 2  # Store the number of input channels C from the derivation.
num_filters_b5 = 4  # Store the number of filters K from the derivation.
weights_per_filter_b5 = filter_height_b5 * filter_width_b5 * input_channels_b5  # Count weights in one filter.
params_per_filter_b5 = weights_per_filter_b5 + 1  # Add one bias for one filter.
total_params_b5 = params_per_filter_b5 * num_filters_b5  # Repeat the per-filter parameters for all filters.
print("conv parameters:", total_params_b5)  # Print 76, matching the boxed parameter count.
```

▶ What you'll see: the convolution layer has 76 trainable parameters.

👀 Takeaway: channel-spanning filters make parameter counts multiply by channels.

#### B6. Apply ReLU to a feature map

Goal: keep positive feature responses and zero out negative responses.

For the feature map

$$
Z=
\begin{bmatrix}
-2 & 1\\
3 & -4
\end{bmatrix},
$$

ReLU applies $\max(0,z)$ to each entry:

$$
\operatorname{ReLU}(Z)=
\begin{bmatrix}
\max(0,-2) & \max(0,1)\\
\max(0,3) & \max(0,-4)
\end{bmatrix}
=
\begin{bmatrix}
0 & 1\\
3 & 0
\end{bmatrix}.
$$

Thus the activated feature map is

$$
\boxed{
\begin{bmatrix}
0 & 1\\
3 & 0
\end{bmatrix}}
$$

Interpretation: ReLU suppresses negative evidence while preserving positive evidence.

```python
feature_b6 = np.array([[-2.0, 1.0], [3.0, -4.0]])  # Store the same feature map from the derivation.
relu_b6 = np.maximum(feature_b6, 0.0)  # Apply ReLU element by element using max(value, 0).
print("ReLU feature map:")  # Label the printed activation map.
print(relu_b6)  # Print [[0, 1], [3, 0]], matching the boxed result.
```

▶ What you'll see: negative entries become 0 while positive entries stay unchanged.

👀 Takeaway: ReLU turns signed responses into nonnegative activations.

```python
feature_b6 = np.array([[-2.0, 1.0], [3.0, -4.0]])  # Recreate the same input feature map for this standalone visualization.
relu_b6 = np.maximum(feature_b6, 0.0)  # Recompute the ReLU output so the cell is self-contained.
plt.imshow(relu_b6)  # Display the activated feature map as a tiny image.
plt.title("B6: ReLU feature map")  # Add a title identifying the basic and concept.
plt.colorbar()  # Show the activation scale beside the image.
plt.show()  # Render the figure in the notebook.
```

▶ What you'll see: a 2-by-2 heatmap where only the positive responses remain bright.

#### B7. Compare stride effect on output size

Goal: see how changing only the stride changes the number of filter placements.

Use $I=7$, $F=3$, $P=0$.

For stride $S=1$,

$$
O=\frac{7-3+0}{1}+1=5.
$$

For stride $S=2$,

$$
O=\frac{7-3+0}{2}+1=3.
$$

Thus the same input and filter produce

$$
\boxed{5\times5\text{ cells at }S=1\quad\text{but}\quad3\times3\text{ cells at }S=2.}
$$

Interpretation: larger stride samples fewer locations.

```python
input_size_b7 = 7  # Store the input height and width I from the derivation.
filter_size_b7 = 3  # Store the filter size F from the derivation.
padding_b7 = 0  # Store the valid-padding value P from the derivation.
stride_one_b7 = 1  # Store the first stride value from the derivation.
stride_two_b7 = 2  # Store the second stride value from the derivation.
output_stride_one_b7 = (input_size_b7 - filter_size_b7 + 2 * padding_b7) // stride_one_b7 + 1  # Compute O for stride 1.
output_stride_two_b7 = (input_size_b7 - filter_size_b7 + 2 * padding_b7) // stride_two_b7 + 1  # Compute O for stride 2.
print("stride 1 output shape:", (output_stride_one_b7, output_stride_one_b7))  # Print (5, 5), matching the boxed result.
print("stride 2 output shape:", (output_stride_two_b7, output_stride_two_b7))  # Print (3, 3), matching the boxed result.
```

▶ What you'll see: stride 1 gives 5-by-5 cells, while stride 2 gives 3-by-3 cells.

👀 Takeaway: stride is a downsampling choice before pooling even happens.

#### B8. Zero-pad a tiny matrix

Goal: add a one-pixel border of zeros around a tiny image.

By layout,

$$
\begin{bmatrix}
1 & 2\\
3 & 4
\end{bmatrix}
\longrightarrow
\begin{bmatrix}
0 & 0 & 0 & 0\\
0 & 1 & 2 & 0\\
0 & 3 & 4 & 0\\
0 & 0 & 0 & 0
\end{bmatrix}.
$$

So the padded image is

$$
\boxed{
\begin{bmatrix}
0 & 0 & 0 & 0\\
0 & 1 & 2 & 0\\
0 & 3 & 4 & 0\\
0 & 0 & 0 & 0
\end{bmatrix}}
$$

Interpretation: padding lets filters visit boundary pixels more symmetrically.

```python
image_b8 = np.array([[1.0, 2.0], [3.0, 4.0]])  # Store the same 2-by-2 image from the derivation.
padded_b8 = np.pad(image_b8, ((1, 1), (1, 1)), mode="constant", constant_values=0.0)  # Add one zero row or column on every side.
print("padded image:")  # Label the printed padded matrix.
print(padded_b8)  # Print the 4-by-4 matrix, matching the boxed result.
```

▶ What you'll see: the original 2-by-2 image sits inside a 4-by-4 zero border.

👀 Takeaway: zero-padding expands spatial size without inventing new pixel evidence.

```python
image_b8 = np.array([[1.0, 2.0], [3.0, 4.0]])  # Recreate the same input image for this standalone visualization.
padded_b8 = np.pad(image_b8, ((1, 1), (1, 1)), mode="constant", constant_values=0.0)  # Recompute the padded image locally.
plt.imshow(padded_b8)  # Display the padded matrix as a tiny image.
plt.title("B8: zero-padded image")  # Add a title identifying the basic and concept.
plt.colorbar()  # Show the pixel-value scale beside the image.
plt.show()  # Render the figure in the notebook.
```

▶ What you'll see: a darker zero border surrounds the brighter original pixels.

#### B9. Apply a vertical-edge filter to one patch

Goal: detect a left-to-right intensity change in one $2\times2$ patch.

Let

$$
X=
\begin{bmatrix}
0 & 3\\
0 & 3
\end{bmatrix},
\qquad
W=
\begin{bmatrix}
-1 & 1\\
-1 & 1
\end{bmatrix}.
$$

The filter response is

$$
\begin{aligned}
Y
&=(0)(-1)+(3)(1)+(0)(-1)+(3)(1)\\
&=0+3+0+3\\
&=6.
\end{aligned}
$$

So

$$
\boxed{Y=6}.
$$

Interpretation: this filter responds positively when the right side is brighter than the left side.

```python
patch_b9 = np.array([[0, 3], [0, 3]])  # Store the same left-dark right-bright patch from the derivation.
kernel_b9 = np.array([[-1, 1], [-1, 1]])  # Store the same vertical-edge filter from the derivation.
products_b9 = patch_b9 * kernel_b9  # Multiply patch intensities by filter weights element by element.
edge_response_b9 = np.sum(products_b9)  # Sum the products to get the vertical-edge response.
print("vertical-edge response:", edge_response_b9)  # Print 6, matching the boxed answer.
```

▶ What you'll see: the right-brighter patch gives a positive edge response of 6.

👀 Takeaway: edge filters compare opposite sides of a local patch.

```python
patch_b9 = np.array([[0, 3], [0, 3]])  # Recreate the same patch for this standalone visualization.
kernel_b9 = np.array([[-1, 1], [-1, 1]])  # Recreate the same filter for this standalone visualization.
products_b9 = patch_b9 * kernel_b9  # Recompute the signed elementwise contributions.
plt.imshow(products_b9)  # Display the contribution map used in the sum.
plt.title("B9: vertical-edge contributions")  # Add a title identifying the basic and concept.
plt.colorbar()  # Show the signed contribution scale beside the image.
plt.show()  # Render the figure in the notebook.
```

▶ What you'll see: positive contributions appear on the bright right side.

#### B10. Flatten a small feature map length

Goal: compute the vector length after flattening a feature tensor.

A feature map with shape

$$
2\times3\times4
$$

has height $2$, width $3$, and channels $4$.

Flattening keeps all values but removes the grid shape:

$$
N_{\text{flat}}=2\cdot3\cdot4=24.
$$

Therefore the flattened vector has length

$$
\boxed{24}.
$$

Interpretation: flattening changes the shape, not the number of activations.

```python
feature_tensor_b10 = np.arange(24).reshape(2, 3, 4)  # Create a tiny tensor with shape 2-by-3-by-4.
flat_vector_b10 = feature_tensor_b10.reshape(-1)  # Flatten the tensor into one vector while keeping all entries.
flat_length_b10 = flat_vector_b10.size  # Count the number of activations in the flattened vector.
print("flattened length:", flat_length_b10)  # Print 24, matching the boxed answer.
print("original shape:", feature_tensor_b10.shape)  # Print the original grid shape for comparison.
print("flattened shape:", flat_vector_b10.shape)  # Print the one-dimensional vector shape after flattening.
```

▶ What you'll see: the 2-by-3-by-4 tensor becomes a length-24 vector.

👀 Takeaway: flattening preserves activation count while discarding grid axes.

### 🟡 Easy

#### E1. Hand-compute one convolution output cell

Goal: compute one cell of a $3\times3$ valid convolution by hand.

Use the $5\times5$ grayscale image

$$
X=
\begin{bmatrix}
0&0&0&0&0\\
0&1&1&1&0\\
0&1&1&1&0\\
0&1&1&1&0\\
0&0&0&0&0
\end{bmatrix}
$$

and the vertical-edge filter

$$
W=
\begin{bmatrix}
-1&0&1\\
-1&0&1\\
-1&0&1
\end{bmatrix}.
$$

For the top-left output cell, the receptive field is

$$
X_{0:3,0:3}=\begin{bmatrix}
0&0&0\\
0&1&1\\
0&1&1
\end{bmatrix}.
$$

Compute the dot product:

$$
\begin{aligned}
Y_{0,0}
&=0(-1)+0(0)+0(1)\\
&\quad +0(-1)+1(0)+1(1)\\
&\quad +0(-1)+1(0)+1(1)\\
&=0+0+0+0+0+1+0+0+1\\
&=2.
\end{aligned}
$$

With zero bias,

$$
\boxed{Y_{0,0}=2}.
$$

Interpretation: the filter sees a transition from dark pixels on the left to bright pixels on the right, so it produces a positive vertical-edge response.

#### E2. Output dimensions for valid and same padding

Goal: compute output shape for two common padding choices.

Use an input image with

$$
I=32,\qquad F=3,\qquad S=1.
$$

**Case 1: valid padding.** Here $P=0$.

$$
\begin{aligned}
O_{\text{valid}}
&=\frac{I-F+2P}{S}+1\\
&=\frac{32-3+2(0)}{1}+1\\
&=29+1\\
&=30.
\end{aligned}
$$

So valid convolution produces

$$
\boxed{30\times30}\text{ spatial output.}
$$

**Case 2: same padding for odd $F$ and $S=1$.** Choose $P=1$.

$$
\begin{aligned}
O_{\text{same}}
&=\frac{I-F+2P}{S}+1\\
&=\frac{32-3+2(1)}{1}+1\\
&=31+1\\
&=32.
\end{aligned}
$$

So same convolution produces

$$
\boxed{32\times32}\text{ spatial output.}
$$

Takeaway: padding preserves boundary information and can keep spatial dimensions unchanged.

#### E3. Parameter count for a CONV→POOL→FC toy CNN

Goal: compute output shapes and learned parameter counts by hand.

Architecture:

$$
32\times32\times3
\longrightarrow
\text{CONV}(F=3,S=1,P=1,K=16)
\longrightarrow
\text{POOL}(F=2,S=2)
\longrightarrow
\text{FC}(10).
$$

**Step 1: CONV output size.**

$$
\begin{aligned}
O_{\text{conv}}
&=\frac{I-F+2P}{S}+1\\
&=\frac{32-3+2(1)}{1}+1\\
&=32.
\end{aligned}
$$

The convolution has $K=16$ filters, so

$$
\boxed{\text{CONV output}=32\times32\times16}.
$$

**Step 2: CONV parameters.**

Each filter spans all $C=3$ input channels:

$$
F\times F\times C=3\times3\times3=27.
$$

Add one bias per filter:

$$
27+1=28.
$$

There are $K=16$ filters:

$$
\#\text{CONV params}=28\times16=\boxed{448}.
$$

**Step 3: POOL output size.**

Pooling uses $I=32$, $F=2$, $S=2$, $P=0$:

$$
\begin{aligned}
O_{\text{pool}}
&=\frac{32-2+2(0)}{2}+1\\
&=\frac{30}{2}+1\\
&=15+1\\
&=16.
\end{aligned}
$$

Pooling is channel-wise, so the number of channels stays $16$:

$$
\boxed{\text{POOL output}=16\times16\times16}.
$$

Pooling has no learned parameters:

$$
\boxed{\#\text{POOL params}=0}.
$$

**Step 4: flatten and FC parameters.**

Flatten length:

$$
N_{\text{in}}=16\cdot16\cdot16=4096.
$$

FC layer with $N_{\text{out}}=10$ has

$$
\begin{aligned}
\#\text{FC params}
&=(N_{\text{in}}+1)N_{\text{out}}\\
&=(4096+1)10\\
&=4097\cdot10\\
&=\boxed{40970}.
\end{aligned}
$$

Total learned parameters:

$$
448+0+40970=\boxed{41418}.
$$

Takeaway: even in a CNN, the FC layer can dominate the parameter count after flattening.

#### E4. Build a tiny CNN-style classifier on synthetic digits

Goal: build the forward pass of a tiny CNN-style classifier using hand-set filters, max pooling, flattening, and a fully connected score layer. This is not a trained industrial CNN; it is a transparent CNN pipeline that runs from scratch and lets us inspect every tensor.

```python
def make_digit_zero(size=16):  # Define a synthetic digit 0 so the example needs no downloaded dataset.
    img = np.zeros((size, size), dtype=float)  # Start with a blank square image.
    img[3:13, 3] = 1.0  # Draw the left stroke of the zero.
    img[3:13, 12] = 1.0  # Draw the right stroke of the zero.
    img[3, 3:13] = 1.0  # Draw the top stroke of the zero.
    img[12, 3:13] = 1.0  # Draw the bottom stroke of the zero.
    return img  # Return the synthetic zero image.


def make_digit_one(size=16):  # Define a synthetic digit 1.
    img = np.zeros((size, size), dtype=float)  # Start with a blank square image.
    img[3:13, 8] = 1.0  # Draw the main vertical stroke.
    img[4, 7] = 1.0  # Draw a small top-left serif.
    img[12, 5:12] = 1.0  # Draw a small base to make the one visually distinct.
    return img  # Return the synthetic one image.


def shift_image(img, dy, dx):  # Define integer translation with zero-filled boundaries.
    shifted = np.zeros_like(img)  # Allocate an empty image of the same shape.
    H, W = img.shape  # Read image height and width.
    src_y0 = max(0, -dy)  # Compute the first source row that remains visible.
    src_y1 = min(H, H - dy)  # Compute the last source row that remains visible.
    src_x0 = max(0, -dx)  # Compute the first source column that remains visible.
    src_x1 = min(W, W - dx)  # Compute the last source column that remains visible.
    dst_y0 = max(0, dy)  # Compute the first destination row after shifting.
    dst_y1 = min(H, H + dy)  # Compute the last destination row after shifting.
    dst_x0 = max(0, dx)  # Compute the first destination column after shifting.
    dst_x1 = min(W, W + dx)  # Compute the last destination column after shifting.
    shifted[dst_y0:dst_y1, dst_x0:dst_x1] = img[src_y0:src_y1, src_x0:src_x1]  # Copy the visible source region.
    return shifted  # Return the translated image.


def make_digit_dataset(n_per_class=20, size=16):  # Build a small dataset of shifted synthetic zeros and ones.
    images = []  # Store generated images in a Python list before stacking.
    labels = []  # Store integer labels where 0 means zero and 1 means one.
    for label, maker in [(0, make_digit_zero), (1, make_digit_one)]:  # Generate both digit classes.
        for _ in range(n_per_class):  # Create several shifted variants per class.
            img = maker(size)  # Draw the clean prototype digit.
            dy = np.random.randint(-1, 2)  # Sample a small vertical shift for mild variation.
            dx = np.random.randint(-1, 2)  # Sample a small horizontal shift for mild variation.
            noisy = shift_image(img, dy, dx) + 0.05 * np.random.randn(size, size)  # Shift the digit and add light noise.
            images.append(normalize_image(noisy))  # Normalize the noisy digit and store it.
            labels.append(label)  # Store the class label.
    return np.stack(images), np.array(labels)  # Return image tensor and label vector.

horizontal_filter = np.array([[-1, -1, -1], [0, 0, 0], [1, 1, 1]], dtype=float)  # Detect horizontal intensity changes.
vertical_filter = np.array([[-1, 0, 1], [-1, 0, 1], [-1, 0, 1]], dtype=float)  # Detect vertical intensity changes.
diagonal_filter = np.array([[0, -1, 1], [-1, 1, -1], [1, -1, 0]], dtype=float)  # Detect simple diagonal contrast.
filter_bank = [horizontal_filter, vertical_filter, diagonal_filter]  # Combine filters into a small convolutional bank.

images, labels = make_digit_dataset(n_per_class=24, size=16)  # Generate a reproducible synthetic digit dataset.
features = []  # Store flattened pooled CNN features for each image.
for img in images:  # Process every image through the transparent CNN front end.
    conv_maps = conv2d_multi_filter(img, filter_bank, stride=1, padding=1)  # Apply three hand-set filters with same padding.
    activated = relu(conv_maps)  # Apply ReLU so positive evidence remains and negative evidence is suppressed.
    pooled_maps = np.stack([max_pool2d(activated[:, :, k], pool_size=2, stride=2) for k in range(activated.shape[-1])], axis=-1)  # Downsample each channel.
    features.append(pooled_maps.reshape(-1))  # Flatten pooled feature maps into one vector for classification.
features = np.stack(features)  # Stack all feature vectors into a design matrix.

class_means = np.stack([features[labels == c].mean(axis=0) for c in [0, 1]])  # Use class mean feature vectors as simple prototypes.
distances = np.stack([np.sum((features - class_means[c]) ** 2, axis=1) for c in [0, 1]], axis=1)  # Compute squared distance to each class prototype.
predictions = np.argmin(distances, axis=1)  # Predict the class with the nearest CNN-feature prototype.
accuracy = np.mean(predictions == labels)  # Compute classification accuracy on this transparent toy dataset.

fig, axes = plt.subplots(2, 4, figsize=(8, 4))  # Create a grid to show representative images and predictions.
for ax, idx in zip(axes.ravel(), range(8)):  # Fill each panel with one example image.
    show_image(ax, images[idx], f"true={labels[idx]}, pred={predictions[idx]}")  # Show the image with its true and predicted class.
plt.suptitle(f"Tiny CNN-style classifier accuracy = {accuracy:.3f}")  # Put the accuracy above the example grid.
plt.tight_layout()  # Reduce spacing so all panels fit cleanly.
plt.show()  # Render the figure.
```

▶ What you'll see: several synthetic digit images labeled with true and predicted classes, plus an accuracy value. Because the shapes are simple, hand-set filters plus prototype classification usually separate zeros from ones well.

👀 Look for why this works: zeros create both vertical and horizontal edge evidence, while ones concentrate vertical evidence near the center.

#### E5. Visualize first-layer filters and feature maps

Goal: inspect the convolutional maps used by the tiny CNN-style pipeline.

```python
example_index = 0  # Select one digit image to trace through the convolutional front end.
example_img = images[example_index]  # Retrieve the selected input image.
example_maps = conv2d_multi_filter(example_img, filter_bank, stride=1, padding=1)  # Compute raw convolution feature maps.
example_relu = relu(example_maps)  # Apply ReLU to keep positive filter matches.
example_pool = np.stack([max_pool2d(example_relu[:, :, k], pool_size=2, stride=2) for k in range(example_relu.shape[-1])], axis=-1)  # Pool each activation map.
filter_names = ["horizontal", "vertical", "diagonal"]  # Name each hand-set filter for display.

fig, axes = plt.subplots(3, 4, figsize=(10, 7))  # Create rows for filters and columns for each processing stage.
for k in range(3):  # Visualize each filter and its corresponding maps.
    show_image(axes[k, 0], filter_bank[k], f"{filter_names[k]} filter")  # Display the filter weights as an image.
    show_image(axes[k, 1], example_maps[:, :, k], "raw conv map")  # Display signed convolution responses.
    show_image(axes[k, 2], example_relu[:, :, k], "after ReLU")  # Display only positive evidence after ReLU.
    show_image(axes[k, 3], example_pool[:, :, k], "after max pool")  # Display the downsampled strongest evidence.
plt.tight_layout()  # Keep the multi-panel figure readable.
plt.show()  # Render the feature-map visualization.
```

▶ What you'll see: each row starts with one filter and then shows raw convolution, ReLU, and max-pooled maps.

👀 Notice that feature maps are still images. A CNN does not immediately discard geometry; it transforms the image into maps of local evidence.

### 🔴 Advanced

#### A1. Stride and padding compatibility edge case

Goal: detect when the output-size formula produces an invalid non-integer result.

Suppose

$$
I=28,\qquad F=5,\qquad S=2.
$$

**Case 1: no padding.**

$$
\begin{aligned}
O
&=\frac{I-F+2P}{S}+1\\
&=\frac{28-5+2(0)}{2}+1\\
&=\frac{23}{2}+1\\
&=11.5+1\\
&=12.5.
\end{aligned}
$$

Because $12.5$ is not an integer,

$$
\boxed{P=0\text{ is incompatible with }I=28,F=5,S=2.}
$$

The issue is that legal starts would be

$$
0,2,4,\ldots
$$

but the last valid start is

$$
I-F=28-5=23,
$$

and $23$ is not divisible by $2$.

**Case 2: add one pixel of padding.**

$$
\begin{aligned}
O
&=\frac{28-5+2(1)}{2}+1\\
&=\frac{25}{2}+1\\
&=12.5+1\\
&=13.5.
\end{aligned}
$$

Still not compatible.

**Case 3: add asymmetric padding with $P_{\text{start}}=1$, $P_{\text{end}}=2$.**

Use the asymmetric formula:

$$
\begin{aligned}
O
&=\frac{I-F+P_{\text{start}}+P_{\text{end}}}{S}+1\\
&=\frac{28-5+1+2}{2}+1\\
&=\frac{26}{2}+1\\
&=13+1\\
&=14.
\end{aligned}
$$

So

$$
\boxed{P_{\text{start}}=1,\ P_{\text{end}}=2\text{ gives a compatible }14\text{-cell output}.}
$$

Takeaway: padding is not only about preserving size; it also controls stride compatibility.

#### A2. Receptive field through stacked layers

Goal: compute how much of the original image one deep activation can see.

Architecture:

$$
\text{CONV}_1(F_1=3,S_1=1)\longrightarrow
\text{CONV}_2(F_2=3,S_2=1)\longrightarrow
\text{POOL}_3(F_3=2,S_3=2).
$$

Use

$$
R_k=1+\sum_{j=1}^{k}(F_j-1)\prod_{i=0}^{j-1}S_i,
\qquad S_0=1.
$$

For layer 1:

$$
\begin{aligned}
R_1
&=1+(F_1-1)S_0\\
&=1+(3-1)(1)\\
&=3.
\end{aligned}
$$

So one first-layer activation sees a $3\times3$ input patch.

For layer 2:

$$
\begin{aligned}
R_2
&=1+(F_1-1)S_0+(F_2-1)S_0S_1\\
&=1+(3-1)(1)+(3-1)(1)(1)\\
&=1+2+2\\
&=5.
\end{aligned}
$$

So one second-layer activation sees a $5\times5$ input patch.

For layer 3:

$$
\begin{aligned}
R_3
&=1+(F_1-1)S_0+(F_2-1)S_0S_1+(F_3-1)S_0S_1S_2\\
&=1+(3-1)(1)+(3-1)(1)(1)+(2-1)(1)(1)(1)\\
&=1+2+2+1\\
&=6.
\end{aligned}
$$

Therefore one pooled activation sees

$$
\boxed{6\times6}\text{ pixels of the original input.}
$$

Takeaway: stacking small filters grows the receptive field gradually while using few parameters.

#### A3. CNN vs fully connected parameter explosion

Goal: compare parameter counts for a fully connected image classifier and a CNN-style classifier on the same $28\times28$ grayscale input.

```python
input_height = 28  # Set the image height to a common MNIST-like value.
input_width = 28  # Set the image width to a common MNIST-like value.
input_channels = 1  # Use grayscale input for a clean parameter-count comparison.
num_classes = 10  # Use ten output classes as in digit classification.

fc_only_inputs = input_height * input_width * input_channels  # Flatten the raw image directly for the FC-only model.
fc_only_params = (fc_only_inputs + 1) * num_classes  # Count weights plus one bias per class.

conv_F = 3  # Use a 3-by-3 convolution filter.
conv_K = 8  # Use eight filters in the first convolutional layer.
conv_P = 1  # Use same padding so the spatial size remains 28 by 28.
conv_S = 1  # Use stride one for dense local scanning.
conv_O_float, conv_O = output_size(input_height, conv_F, conv_S, conv_P)  # Compute the convolution output size.
conv_params = (conv_F * conv_F * input_channels + 1) * conv_K  # Count convolution weights and biases.
pool_O_float, pool_O = output_size(conv_O, 2, 2, 0)  # Compute 2-by-2 stride-2 pooling output size.
flattened_after_pool = pool_O * pool_O * conv_K  # Compute the feature vector length after pooling.
cnn_fc_params = (flattened_after_pool + 1) * num_classes  # Count the final classifier parameters.
cnn_total_params = conv_params + cnn_fc_params  # Add convolution and FC parameters for the total CNN-style count.

names = ["FC directly on pixels", "CONV→POOL→FC"]  # Name the two architectures for the bar chart.
counts = [fc_only_params, cnn_total_params]  # Store the parameter counts for plotting.

fig, ax = plt.subplots(1, 1, figsize=(6, 4))  # Create one bar-chart axis.
ax.bar(names, counts, color=["lightgray", "dimgray"])  # Draw bars with neutral colors.
ax.set_ylabel("learned parameters")  # Label the y-axis with the quantity being compared.
ax.set_title("Parameter count comparison")  # Add a descriptive title.
for i, value in enumerate(counts):  # Annotate each bar with its exact parameter count.
    ax.text(i, value, f"{value:,}", ha="center", va="bottom")  # Place a formatted label above the bar.
plt.xticks(rotation=10)  # Rotate labels slightly so they do not overlap.
plt.tight_layout()  # Fit labels and annotations inside the figure.
plt.show()  # Render the bar chart.
```

▶ What you'll see: the CNN-style model has more stages but can still be parameter-efficient because convolution shares small filters across all locations.

👀 In this tiny example the final FC layer still matters. In larger images, replacing large FC layers with more convolution/pooling is often essential.

#### A4. Feature maps under different filters

Goal: implement 2-D convolution from scratch and visualize how different hand-set filters transform the same image.

```python
image = get_image(DATA_SOURCE, size=32)  # Load the active synthetic image source.
blur_filter = np.ones((3, 3), dtype=float) / 9.0  # Define a blur filter that averages neighboring pixels.
sharpen_filter = np.array([[0, -1, 0], [-1, 5, -1], [0, -1, 0]], dtype=float)  # Define a sharpen filter that boosts center contrast.
vertical_edge_filter = np.array([[-1, 0, 1], [-2, 0, 2], [-1, 0, 1]], dtype=float)  # Define a Sobel-like vertical edge filter.
horizontal_edge_filter = np.array([[-1, -2, -1], [0, 0, 0], [1, 2, 1]], dtype=float)  # Define a Sobel-like horizontal edge filter.
filters = [blur_filter, sharpen_filter, vertical_edge_filter, horizontal_edge_filter]  # Collect filters into a list.
filter_titles = ["blur", "sharpen", "vertical edge", "horizontal edge"]  # Store human-readable filter names.
feature_maps = [conv2d_single(image, kernel, stride=1, padding=1) for kernel in filters]  # Convolve the image with each filter.

fig, axes = plt.subplots(2, 5, figsize=(12, 5))  # Create a grid for filters and resulting feature maps.
show_image(axes[0, 0], image, "input image")  # Show the original image in the first panel.
show_image(axes[1, 0], image, "input again")  # Repeat the input to align the two-row layout.
for k, kernel in enumerate(filters):  # Fill one column per filter.
    show_image(axes[0, k + 1], kernel, f"{filter_titles[k]} filter")  # Visualize the filter weights.
    show_image(axes[1, k + 1], feature_maps[k], f"{filter_titles[k]} map")  # Visualize the corresponding response map.
plt.tight_layout()  # Make sure titles and panels fit.
plt.show()  # Render the filter bank visualization.
```

▶ What you'll see: blur smooths the image, sharpen emphasizes local contrast, and edge filters light up where intensity changes in the corresponding direction.

👀 Compare filter weights with feature maps. Positive and negative weights are not arbitrary; they define which local pattern earns a large dot product.

#### A5. Show the effect of stride, padding, and an edge-detection filter

Goal: run the same hand-set edge filter with different stride and padding choices, then stress-test translation sensitivity.

```python
edge_kernel = vertical_edge_filter  # Reuse the vertical edge detector from the previous example.
settings = [(1, 0), (1, 1), (2, 0), (2, 1)]  # Compare stride and padding combinations as (stride, padding).
edge_outputs = []  # Store feature maps for each setting.
setting_titles = []  # Store readable titles for each setting.
for stride, padding in settings:  # Apply every stride-padding configuration.
    fmap = conv2d_single(image, edge_kernel, stride=stride, padding=padding)  # Compute the feature map from scratch.
    edge_outputs.append(fmap)  # Save the feature map for visualization.
    setting_titles.append(f"S={stride}, P={padding}, shape={fmap.shape}")  # Record the output shape in the title.

shifted_image = shift_image(image, dy=3, dx=4)  # Create a translated version of the same image.
original_edge = conv2d_single(image, edge_kernel, stride=1, padding=1)  # Compute edge responses for the original image.
shifted_edge = conv2d_single(shifted_image, edge_kernel, stride=1, padding=1)  # Compute edge responses for the shifted image.
pooled_original = max_pool2d(relu(original_edge), pool_size=2, stride=2)  # Pool original positive edge evidence.
pooled_shifted = max_pool2d(relu(shifted_edge), pool_size=2, stride=2)  # Pool shifted positive edge evidence.
pooled_difference = np.mean(np.abs(pooled_original - pooled_shifted))  # Measure how much pooled evidence changed after translation.

fig, axes = plt.subplots(2, 4, figsize=(12, 6))  # Create a two-row comparison figure.
for ax, fmap, title in zip(axes[0], edge_outputs, setting_titles):  # Fill the first row with stride-padding maps.
    show_image(ax, fmap, title)  # Show how output shape and detail change.
show_image(axes[1, 0], image, "original image")  # Show the original input.
show_image(axes[1, 1], shifted_image, "shifted image")  # Show the translated input.
show_image(axes[1, 2], pooled_original, "pooled original edges")  # Show pooled original edge evidence.
show_image(axes[1, 3], pooled_shifted, f"pooled shifted edges\nmean |diff|={pooled_difference:.3f}")  # Show pooled shifted evidence and difference.
plt.tight_layout()  # Fit all titles and panels.
plt.show()  # Render the stride-padding and translation-stress visualization.
```

▶ What you'll see: padding changes boundary coverage, stride changes output resolution, and shifting the image changes the precise feature map even when the visual object is the same.

👀 Pooling reduces resolution and can soften small shifts, but it does not create perfect translation invariance. CNN robustness comes from architecture, data augmentation, and training together.

### Interactive Experiment

Use the sliders to change filter size, stride, and padding. The readout applies the CS 230 output-size formula and, when compatible, shows a feature map from a simple average filter.

```python
try:  # Try to import widget tools when the notebook environment supports them.
    from ipywidgets import interact, IntSlider  # Import interactive sliders for live experimentation.
    widgets_available = True  # Record that interactive controls are available.
except Exception:  # Fall back gracefully when ipywidgets is not installed.
    widgets_available = False  # Record that widgets are unavailable.


def interactive_cnn_readout(filter_size=3, stride=1, padding=1):  # Define the live output-size and feature-map experiment.
    O_float, O_int = output_size(32, filter_size, stride, padding)  # Compute the formula value for the chosen hyperparameters.
    print(f"O = (32 - {filter_size} + 2·{padding}) / {stride} + 1 = {O_float}")  # Print the substituted formula.
    if O_int is None:  # Check whether the result is compatible with integer sliding windows.
        print("Not compatible: the output size is not an integer, so the windows do not land exactly.")  # Explain the invalid setting.
        return  # Stop before trying to draw an invalid convolution.
    kernel = np.ones((filter_size, filter_size), dtype=float) / (filter_size * filter_size)  # Build an average filter of the selected size.
    fmap = conv2d_single(base_image, kernel, stride=stride, padding=padding)  # Compute the resulting feature map from scratch.
    fig, axes = plt.subplots(1, 2, figsize=(8, 4))  # Create side-by-side input and output panels.
    show_image(axes[0], base_image, "input")  # Show the original active image.
    show_image(axes[1], fmap, f"feature map shape={fmap.shape}")  # Show the filtered output and its shape.
    plt.tight_layout()  # Keep the figure layout clean.
    plt.show()  # Render the live figure.

if widgets_available:  # Use real sliders when ipywidgets is present.
    interact(interactive_cnn_readout, filter_size=IntSlider(min=1, max=9, step=2, value=3), stride=IntSlider(min=1, max=4, step=1, value=1), padding=IntSlider(min=0, max=5, step=1, value=1))  # Launch the interactive controls.
else:  # Use one deterministic run when widgets are unavailable.
    interactive_cnn_readout(filter_size=3, stride=1, padding=1)  # Run the same experiment once as a non-interactive fallback.
```

▶ What you'll see: with widgets enabled, moving sliders immediately changes the formula readout and feature-map size. Without widgets, the cell prints and plots the default compatible setting.

👀 Try increasing stride. The feature map becomes smaller because fewer window positions are evaluated. Try increasing padding. The filter sees more boundary positions, often increasing the output size.
